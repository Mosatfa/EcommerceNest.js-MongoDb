import { Request } from "express";
import { CreateCategoryDto } from "../dtos/create-category.dto";
import { UpdateCategoryDto } from "../dtos/update-category.dto";
import { Category } from "../schema/category.schema";
import { CustomRequest } from "src/common/interfaces/custom-request.interface";


export interface ICategoryService {
  getCategory(): Promise<Category[]>;
  createCategory(req: CustomRequest, createCategoryDto: CreateCategoryDto, file: Express.Multer.File): Promise<Category>;
  updateCategory(req: CustomRequest, categoryId: string, updateCategoryDto: UpdateCategoryDto, file: Express.Multer.File): Promise<Category>;
  deleteCategory(categoryId: string): Promise<{ message: string }>
}