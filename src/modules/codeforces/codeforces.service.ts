import { Injectable } from '@nestjs/common';
import { getCodeForcesQuestions, slugify } from 'src/shared/utils/common.util';
import { sendErrorFromMicroservice } from 'src/shared/utils/response.util';
import { CodeforcesQuestionModel } from 'src/models/system-config/codeforces-questions.model';
import { ITagModel, TagModel } from 'src/models/system-config/tags.model';
import { Platform, QuestionTagMappingModel } from 'src/models/system-config/question-tag-mapping.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class CodeforcesService {
    constructor(
        private readonly sequelize: Sequelize,
    ) { }

    async addProblemsCodeforces() {
        const transaction = await this.sequelize.transaction(); // Start a transaction

        try {
            const response = await getCodeForcesQuestions();

            if (response.status !== 'OK' || !response.result?.problems) {
                throw new Error('Failed to fetch questions from Codeforces');
            }

            const problems = response.result.problems;

            // Prepare bulk insert data for questions
            const questionsData = problems.map((problem: any) => ({
                contest_id: problem.contestId,
                name: problem.name,
                slug: slugify(problem.name) + `__${problem.contestId}` + `__${problem.index}`,
                points: problem.points || 0,
                rating: problem.rating || 0,
                index: problem.index,
                url: `https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`,
                created_by: 0,
                updated_by: 0,
            }));

            // Bulk insert questions into the database
            const insertedQuestions = await CodeforcesQuestionModel.bulkCreate(questionsData, {
                returning: true, // Return the inserted rows
                transaction, // Use the transaction
                updateOnDuplicate: ['name', 'points', 'rating', 'url', 'updated_by'], // Fields to update if duplicate
            });

            // Map question IDs to their slugs for efficient tag mapping
            const questionSlugToIdMap = insertedQuestions.reduce((map, question) => {
                map[question.slug] = question.question_id;
                return map;
            }, {} as Record<string, number>);

            // Fetch all tags from the database to avoid multiple queries
            const allTags: ITagModel[] = await TagModel.findAll({ transaction }); // Use the transaction
            const tagSlugToIdMap = allTags.reduce((map, tag) => {
                map[tag.slug] = tag.tag_id;
                return map;
            }, {} as Record<string, number>);

            // Prepare bulk insert data for question-tag mappings
            const questionTagMappings: any[] = [];
            for (const problem of problems) {
                const questionId = questionSlugToIdMap[slugify(problem.name) + `__${problem.contestId}` + `__${problem.index}`];
                if (!questionId) continue;

                for (const tag of problem.tags) {
                    const tagSlug = slugify(tag);
                    const tagId = tagSlugToIdMap[tagSlug];
                    if (tagId) {
                        if (!questionTagMappings.some(mapping =>
                            mapping.question_id === questionId &&
                            mapping.platform === Platform.CODEFORCES &&
                            mapping.tag_id === tagId
                        )) {
                            questionTagMappings.push({
                                question_id: questionId,
                                platform: Platform.CODEFORCES,
                                tag_id: tagId,
                                created_by: 0,
                                updated_by: 0,
                            });
                        }
                    }
                }
            }

            // Bulk insert question-tag mappings into the database
            await QuestionTagMappingModel.bulkCreate(questionTagMappings, {
                transaction, updateOnDuplicate: ['tag_id', 'updated_by'], // Fields to update if duplicate
            }); // Use the transaction

            await transaction.commit(); // Commit the transaction
            return { message: 'Questions and tags mapped successfully' };
        } catch (error) {
            await transaction.rollback(); // Rollback the transaction on error
            return sendErrorFromMicroservice(error.response?.message || error.message, error);
        }
    }
}
