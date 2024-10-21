import { UpdateSubCategoryDto } from './dtos/update-subcategory.dto';
import { CreateSubCategoryDto } from './dtos/create-subcategory.dto';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Subcategory } from './schema/subcategory.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import { IsubCategoryService } from './interfaces/subcategory.interface';
import { CustomRequest } from 'src/common/interfaces/custom-request.interface';


@Injectable()
export class SubcategoryService implements IsubCategoryService {
    constructor(
        @InjectModel(Subcategory.name) private subcategoryModel: Model<Subcategory>,
        @InjectModel(Category.name) private categoryModel: Model<Category>,
        private cloudinaryService: CloudinaryService
    ) { }

    async getSubcategory(): Promise<Subcategory[]> {
        return await this.subcategoryModel.find({})
    }

    async createSubCategory(req: CustomRequest, categoryId: string, createSubCategoryDto: CreateSubCategoryDto, file: Express.Multer.File): Promise<Subcategory> {
        const newName = createSubCategoryDto.name.toLocaleLowerCase()

        const existCategory = await this.categoryModel.findById(categoryId)
        if (!existCategory) {
            throw new NotFoundException('In-Valid Id Category')
        }

        if (await this.subcategoryModel.findOne({ newName })) {
            throw new ConflictException(`Duplicate subcategory name ${newName}`)
        }

        const customId = uuidv4()
        const { secure_url, public_id } = await this.cloudinaryService.uploadFile(file, `category/${categoryId}/${customId}`)

        const newSubCategory = await this.subcategoryModel.create({
            name: newName,
            slug: slugify(newName, '-'),
            image: { secure_url, public_id },
            categoryId,
            customId,
            createdBy: req.user._id
        })

        return newSubCategory
    }

    async updateSubCategory(req: CustomRequest, categoryId: string, subcategoryId: string, updateSubCategoryDto: UpdateSubCategoryDto, file: Express.Multer.File): Promise<Subcategory> {

        const existSubCategory = await this.subcategoryModel.findOne({ _id: subcategoryId, categoryId })
        if (!existSubCategory) {
            throw new NotFoundException('In-Valid SubcategoryId OR CategoryId')
        }

        if (updateSubCategoryDto.name) {
            const newName = updateSubCategoryDto.name.toLocaleLowerCase()

            if (existSubCategory.name == newName) {
                throw new ConflictException(`Sorry can't update because The new name is the same as the old one`)
            }

            if (await this.subcategoryModel.findOne({ name: newName })) {
                throw new ConflictException(`Duplicate subcategory name ${newName}`)
            }
            existSubCategory.name = newName
            existSubCategory.slug = slugify(newName, { lower: true, strict: true })
        }

        if (file) {
            const { secure_url, public_id } = await this.cloudinaryService.uploadFile(file, `category/${categoryId}}/${existSubCategory.customId}`)
            await this.cloudinaryService.destroy(existSubCategory.image.public_id)
            existSubCategory.image = { secure_url, public_id }
        }


        existSubCategory.updatedBy = req.user._id
        existSubCategory.save()

        return existSubCategory
    }
}
