import { Injectable } from '@nestjs/common';
import { getProblemsGeeksForGeeks } from 'src/shared/utils/common.util';
import { sendErrorFromMicroservice } from 'src/shared/utils/response.util';
import { config } from 'src/config/config';
import { GeeksForGeeksQuestionModel } from 'src/models/system-config/geeks-for-geeks-questions.model';
import { Platform, QuestionTagMappingModel } from 'src/models/system-config/question-tag-mapping.model';
import { TagModel } from 'src/models/system-config/tags.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class GeeksForGeeksService {

    constructor(
        private readonly sequelize: Sequelize
    ) { }

    // This function is purposefully made extremely slow to avoid rate limiting 
    // and to avoid getting blocked by the platform
    async addProblemsGeeksForGeeks() {

        const transaction = await this.sequelize.transaction();

        try {

            for (let i = 1; i < 99999; i++) {
                const response = await getProblemsGeeksForGeeks(i);

                if (response.results.length === 0) {
                    break;
                }

                await new Promise(resolve => setTimeout(resolve, 2000));

                for (const problem of response.results) {
                    const { id, problem_name, problem_type, problem_level, slug, accuracy,
                        all_submissions, marks, difficulty, tags, problem_url, content_type
                    } = problem;


                    const existingProblem = await GeeksForGeeksQuestionModel.findOne({
                        where: {
                            slug,
                        },
                        transaction,
                    });

                    let insertedProblem = null;

                    if (existingProblem) {
                        insertedProblem = await GeeksForGeeksQuestionModel.create({
                            platform_question_id: id,
                            name: problem_name,
                            slug: `${slug}-${id}`,
                            accuracy: accuracy.slice(0, -1).trim(),
                            all_submissions,
                            points: marks,
                            difficulty,
                            problem_type,
                            problem_level,
                            content_type,
                            url: problem_url,
                            created_by: 0,
                            updated_by: 0,
                        }, { transaction });
                    } else {
                        insertedProblem = await GeeksForGeeksQuestionModel.create({
                            platform_question_id: id,
                            name: problem_name,
                            slug,
                            accuracy: accuracy.slice(0, -1).trim(),
                            all_submissions,
                            points: marks,
                            difficulty,
                            problem_type,
                            problem_level,
                            content_type,
                            url: problem_url,
                            created_by: 0,
                            updated_by: 0,
                        }, { transaction });
                    }

                    for (const tag of tags.topic_tags) {
                        const tagSlug = config.geeksForGeeksTagsMapping[tag];
                        const tagId = await TagModel.findOne({
                            where: {
                                slug: tagSlug,
                            },
                            attributes: ['tag_id'],
                            transaction,
                        });
                        if (tagId) {
                            const alreadyExists = await QuestionTagMappingModel.findOne({
                                where: {
                                    question_id: insertedProblem.question_id,
                                    platform: Platform.GEEKS_FOR_GEEKS,
                                    tag_id: tagId.tag_id,
                                },
                                transaction,
                            });
                            if (!alreadyExists) {
                                await QuestionTagMappingModel.create({
                                    question_id: insertedProblem.question_id,
                                    platform: Platform.GEEKS_FOR_GEEKS,
                                    tag_id: tagId.tag_id,
                                    created_by: 0,
                                    updated_by: 0,
                                }, { transaction });
                            }
                        }
                    }
                }

                console.log(i);

            }

            await transaction.commit();

            return { message: 'Problems added successfully' };
        } catch (error) {
            await transaction.rollback();
            console.error(error);
            return sendErrorFromMicroservice(error.message, error);
        }

    }
}
