import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './schema/category.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import slugify from 'slugify';
import { UpdateCategoryDto } from './dtos/update-category.dto';


@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<Category>,
        private cloudinaryService: CloudinaryService
    ) { }

    async getCategory(): Promise<Category[]> {
        const category = await this.categoryModel.find();
        return category
    }

    async createCategory(createCategoryDto: CreateCategoryDto, file: Express.Multer.File): Promise<Category> {
        const name = createCategoryDto.name.toLocaleUpperCase()

        if (await this.categoryModel.findOne({ name })) {
            throw new ConflictException(`Duplicate category name: ${name}`)
        }

        const { secure_url, public_id } = await this.cloudinaryService.uploadFile(file, 'category')

        const newCategory = await this.categoryModel.create({
            name,
            slug: slugify(name.toLocaleLowerCase(), { lower: true, strict: true }),
            image: { secure_url, public_id },
            // createdBy
        })
        return newCategory
    }

    async updateCategory(categoryId: string, updateCategoryDto: UpdateCategoryDto, file: Express.Multer.File): Promise<Category> {
        const category = await this.categoryModel.findById(categoryId);

        if (!category) {
            throw new NotFoundException(`Category with ID ${categoryId} not found`)
        }

        if (updateCategoryDto.name) {    
            const newName = updateCategoryDto.name.toLocaleUpperCase()
            if (category.name == newName) {
                throw new ConflictException(`Sorry, can't update because the new name is the same as the old one`);
            }
            if (await this.categoryModel.findOne({ name: newName })) {
                throw new ConflictException(`Duplicate category name: ${newName}`);
            }
            category.name = newName
            category.slug = slugify(newName.toLocaleLowerCase(), { lower: true, strict: true })
        }

        if (file) {
            console.log('Update file');

            const { secure_url, public_id } = await this.cloudinaryService.uploadFile(file, 'category')
            await this.cloudinaryService.destroy(category.image.public_id)
            category.image = { secure_url, public_id }
        }

        // category.updatedBy = admin id
        await category.save()
        return category
    }
}
