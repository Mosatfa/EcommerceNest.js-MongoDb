import { CustomRequest } from "src/common/interfaces/custom-request.interface";
import { CreateSubCategoryDto } from "../dtos/create-subcategory.dto";
import { UpdateSubCategoryDto } from "../dtos/update-subcategory.dto";
import { Subcategory } from "../schema/subcategory.schema";


export interface IsubCategoryService {
    getSubcategory(categoryId: string): Promise<Subcategory[]>;
    createSubCategory(req:CustomRequest,categoryId: string, createSubCategoryDto: CreateSubCategoryDto, file: Express.Multer.File): Promise<Subcategory>;
    updateSubCategory(req:CustomRequest,categoryId: string, subcategoryId:string, updateSubCategoryDto: UpdateSubCategoryDto, file: Express.Multer.File): Promise<Subcategory>;
}