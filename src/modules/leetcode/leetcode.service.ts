import { Injectable } from '@nestjs/common';
import { getProblemsLeetcode } from 'src/shared/utils/common.util';
import { sendErrorFromMicroservice } from 'src/shared/utils/response.util';

@Injectable()
export class LeetcodeService {
    constructor() {

    }

    async addProblemsLeetcode() {

        try {

            const response = await getProblemsLeetcode();

            const allTags = [];

            const tags = response.data.problemsetQuestionList.questions.map((question: any) => {
                allTags.push(question.topicTags.map((tag: any) => tag.name))
            });

            const uniqueTags = [...new Set(allTags.flat())];

            return uniqueTags;

        } catch (error) {
            return sendErrorFromMicroservice(error.message, error);
        }

    }
}
