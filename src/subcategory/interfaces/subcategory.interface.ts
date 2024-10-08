import { CreateSubCategoryDto } from "../dtos/create-subcategory.dto";
import { UpdateSubCategoryDto } from "../dtos/update-subcategory.dto";
import { Subcategory } from "../schema/subcategory.schema";


export interface IsubCategoryService {
    getSubcategory(categoryId: string): Promise<Subcategory[]>;
    createSubCategory(categoryId: string, createSubCategoryDto: CreateSubCategoryDto, file: Express.Multer.File): Promise<Subcategory>;
    updateSubCategory(categoryId: string, subcategoryId:string, updateSubCategoryDto: UpdateSubCategoryDto, file: Express.Multer.File): Promise<Subcategory>;
}