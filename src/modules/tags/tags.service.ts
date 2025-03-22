import { Injectable } from '@nestjs/common';
import { AddTagDTO } from './dto/add-tags-dto';
import { sendErrorFromMicroservice } from 'src/shared/utils/response.util';
import { TagModel } from 'src/models/system-config/tags.model';

@Injectable()
export class TagsService {
    constructor() {
        
    }

    async addTags(body: AddTagDTO) {

        try {

            const bulkInsertBody = body.tags.map((tag: any) => {
                return {
                    name: tag.name,
                    slug: tag.slug,
                    created_by: 0,
                    updated_by: 0
                };
            });

            await TagModel.bulkCreate(bulkInsertBody, {
                updateOnDuplicate: ['name', 'slug', 'updated_by']
            });

            return { message: 'Tags added successfully' };
            
        } catch (error) {
            console.log(error);
            return sendErrorFromMicroservice(error.message, error);
        }

    }
}
