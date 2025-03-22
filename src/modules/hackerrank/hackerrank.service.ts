import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { getProblemsHackerank } from 'src/shared/utils/common.util';
import { sendErrorFromMicroservice } from 'src/shared/utils/response.util';

@Injectable()
export class HackerrankService {

    constructor(
        private readonly sequelize: Sequelize,
    ) { }

    async addProblemsHackerank() {
        try {

            const allTags = []

            for(let i=0; i<1000000;i+=50) {
                const response = await getProblemsHackerank(i);

                if(response.models.length === 0) {
                    break;
                }

                

                await new Promise(resolve => setTimeout(resolve, 4000));

                console.log(`Fetched ${i} problems from Hackerank`);

            }
            
            const uniqueTags = Array.from(new Set(allTags.flat()));

            return uniqueTags;

        } catch (error) {
            return sendErrorFromMicroservice(error.message, error);
        }
    }
}
