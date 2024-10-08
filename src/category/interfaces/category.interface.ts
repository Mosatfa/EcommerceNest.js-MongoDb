import { CreateCategoryDto } from "../dtos/create-category.dto";
import { UpdateCategoryDto } from "../dtos/update-category.dto";
import { Category } from "../schema/category.schema";


export interface ICategoryService {
  getCategory(): Promise<Category[]>;
  createCategory(createCategoryDto: CreateCategoryDto, file: Express.Multer.File): Promise<Category>;
  updateCategory(categoryId: string, updateCategoryDto: UpdateCategoryDto, file: Express.Multer.File): Promise<Category>;
}