import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { LeetcodeQuestionModel } from 'src/models/system-config/leetcode-questions.model';
import { TagModel } from 'src/models/system-config/tags.model';
import { QuestionTagMappingModel, Platform } from 'src/models/system-config/question-tag-mapping.model';
import { config } from 'src/config/config';
import { getProblemsLeetcode } from 'src/shared/utils/common.util';
import { sendErrorFromMicroservice } from 'src/shared/utils/response.util';

@Injectable()
export class LeetcodeService {
    constructor(private readonly sequelize: Sequelize) { }

    async addProblemsLeetcode() {
        const transaction = await this.sequelize.transaction();
        try {
            const response = await getProblemsLeetcode();
            const questions = response.data.problemsetQuestionList.questions;

            // Fetch all tags from the database
            const tags = await TagModel.findAll({ transaction });
            const tagMap = tags.reduce((map, tag) => {
                map[tag.slug] = tag.tag_id;
                return map;
            }, {});

            // Prepare bulk insert data for questions and mappings
            const questionInserts = [];
            const tagMappingInserts = [];

            for (const question of questions) {
                const { frontendQuestionId, title, titleSlug, difficulty, acRate, topicTags } = question;

                // Add question to the bulk insert array
                questionInserts.push({
                    platform_question_id: frontendQuestionId,
                    name: title,
                    slug: titleSlug,
                    difficulty,
                    accuracy: acRate,
                    url: `https://leetcode.com/problems/${titleSlug}`,
                    created_by: 0,
                    updated_by: 0,
                });

                // Map topic tags to tag IDs and prepare tag mappings
                for (const tag of topicTags) {
                    const tagSlug = config.leetcodeTagsMapping[tag.name];
                    const tagId = tagMap[tagSlug];
                    if (tagId) {
                        tagMappingInserts.push({
                            question_id: frontendQuestionId, // This will be updated after question insertion
                            platform: Platform.LEETCODE,
                            tag_id: tagId,
                            created_by: null, // Replace with actual user ID if available
                            updated_by: null, // Replace with actual user ID if available
                        });
                    }
                }
            }

            // Bulk insert questions
            const insertedQuestions = await LeetcodeQuestionModel.bulkCreate(questionInserts, {
                transaction,
                returning: true,
                updateOnDuplicate: ['name', 'slug', 'difficulty', 'accuracy', 'url', 'updated_by'], // Fields to update if duplicate
            });

            // Map inserted question IDs to their platform_question_id
            const questionIdMap = insertedQuestions.reduce((map, question) => {
                map[question.platform_question_id] = question.question_id;
                return map;
            }, {});

            // Update question IDs in tag mappings
            for (const mapping of tagMappingInserts) {
                mapping.question_id = questionIdMap[mapping.question_id];
            }

            // Bulk insert tag mappings
            await QuestionTagMappingModel.bulkCreate(
                tagMappingInserts,

                {
                    transaction, updateOnDuplicate: ['tag_id', 'question_id', 'updated_by',], // Fields to update if duplicate
                });

            // Commit the transaction
            await transaction.commit();

            return { message: 'Problems added successfully' };
        } catch (error) {
            // Rollback the transaction in case of an error
            await transaction.rollback();
            console.error(error);
            return sendErrorFromMicroservice(error.message, error);
        }
    }
}
