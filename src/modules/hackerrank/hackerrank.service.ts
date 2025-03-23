import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { HackerRankQuestionModel } from 'src/models/system-config/hackerank-questions.model';
import { getProblemsHackerank } from 'src/shared/utils/common.util';
import { sendErrorFromMicroservice } from 'src/shared/utils/response.util';
import { config } from 'src/config/config';
import { TagModel } from 'src/models/system-config/tags.model';
import { Platform, QuestionTagMappingModel } from 'src/models/system-config/question-tag-mapping.model';
@Injectable()
export class HackerrankService {

    constructor(
        private readonly sequelize: Sequelize,
    ) { }

    async addProblemsHackerank() {

        const transaction = await this.sequelize.transaction();

        try {

            const allTags = []

            for (let i = 0; i < 1000000; i += 50) {
                const response = await getProblemsHackerank(i);

                if (response.models.length === 0) {
                    break;
                }

                await new Promise(resolve => setTimeout(resolve, 4000));

                for (const problem of response.models) {
                    const { id, name, slug, success_ratio, total_count, solved_count, max_score,
                        difficulty_name, tag_names
                    } = problem;

                    const existingProblem = await HackerRankQuestionModel.findOne({
                        where: {
                            slug,
                        },
                        transaction,
                    });

                    if (!existingProblem) {
                        const question = await HackerRankQuestionModel.create({
                            platform_question_id: id,
                            name,
                            slug,
                            all_submissions: total_count,
                            accepted_solution: solved_count,
                            points: max_score,
                            accuracy: success_ratio * 100,
                            difficulty: difficulty_name,
                            url: `https://www.hackerrank.com/challenges/${slug}/problem?isFullScreen=true`,
                            created_by: 0,
                            updated_by: 0,
                        }, { transaction });

                        for (let tag of tag_names) {
                            const mappedTag = config.hackerankTagsMapping[tag];

                            const existingTag = await TagModel.findOne({
                                where: {
                                    slug: mappedTag,
                                },
                                transaction,
                            });

                            if (existingTag) {

                                const tagMapping = await QuestionTagMappingModel.findOne({
                                    where: {
                                        question_id: question.question_id,
                                        tag_id: existingTag.tag_id,
                                        platform: Platform.HACKERANK,
                                    },
                                    transaction,
                                });

                                if (!tagMapping) {
                                    await QuestionTagMappingModel.create({
                                        question_id: question.question_id,
                                        platform: Platform.HACKERANK,
                                        tag_id: existingTag.tag_id,
                                        created_by: 0,
                                        updated_by: 0,
                                    }, { transaction });
                                }


                            } else {
                                const newTag = await TagModel.create({
                                    name: tag,
                                    slug: mappedTag,
                                    created_by: 0,
                                    updated_by: 0,
                                }, { transaction });

                                const tagMapping = await QuestionTagMappingModel.findOne({
                                    where: {
                                        question_id: question.question_id,
                                        tag_id: newTag.tag_id,
                                        platform: Platform.HACKERANK,
                                    },
                                    transaction,
                                });

                                if (!tagMapping) {
                                    await QuestionTagMappingModel.create({
                                        question_id: question.question_id,
                                        platform: Platform.HACKERANK,
                                        tag_id: newTag.tag_id,
                                        created_by: 0,
                                        updated_by: 0,
                                    }, { transaction });
                                }

                            }
                        }

                    }

                }

            }

            await transaction.commit();

            return {
                message: 'Problems added successfully',
            };

        } catch (error) {
            await transaction.rollback();
            console.error(error);
            return sendErrorFromMicroservice(error.message, error);
        }
    }
}
