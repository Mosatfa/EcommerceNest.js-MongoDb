import { CategoryService } from './category.service';
import { Body, Controller, Get, HttpCode, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Category } from './schema/category.schema';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createParseFilePipe } from 'src/common/files/files-validation-factory';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-objectid.pipe';
import { ICategoryService } from './interfaces/category.interface';

@Controller('category')
export class CategoryController implements ICategoryService {
    constructor(private categoryService: CategoryService) { }
    @Get()
    @HttpCode(200)
    async getCategory(): Promise<Category[]> {
        return await this.categoryService.getCategory();
    }

    @Post()
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('file'))
    async createCategory(@Body() createCategoryDto: CreateCategoryDto, @UploadedFile(
        createParseFilePipe('2MB', ['jpeg', 'png', 'jpg'], true)
    ) file: Express.Multer.File): Promise<Category> {
        return await this.categoryService.createCategory(createCategoryDto, file)
    }

    @Put(':categoryId')
    @HttpCode(200)
    @UseInterceptors(FileInterceptor('file'))
    async updateCategory(@Param('categoryId', ParseObjectIdPipe) categoryId: string, @Body() updateCategoryDto: UpdateCategoryDto, @UploadedFile(
        createParseFilePipe('2MB', ['jpeg', 'png', 'jpg'],false)
    ) file: Express.Multer.File): Promise<Category> {
        return await this.categoryService.updateCategory(categoryId, updateCategoryDto, file)
    }
}
