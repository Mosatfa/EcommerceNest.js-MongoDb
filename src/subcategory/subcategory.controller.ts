import { CreateSubCategoryDto } from './dtos/create-subcategory.dto';
import { Body, Controller, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Subcategory } from './schema/subcategory.schema';
import { UpdateSubCategoryDto } from './dtos/update-subcategory.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createParseFilePipe } from 'src/common/files/files-validation-factory';
import { IsubCategoryService } from './interfaces/subcategory.interface';
import { SubcategoryService } from './subcategory.service';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-objectid.pipe';

@Controller('category/:categoryId/subcategory')
export class SubcategoryController implements IsubCategoryService {
    constructor(private subcategoryService: SubcategoryService) { }

    @Get()
    async getSubcategory(): Promise<Subcategory[]> {
        return await this.getSubcategory()
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async createSubCategory(@Param('categoryId', ParseObjectIdPipe) categoryId: string, @Body() createSubCategoryDto: CreateSubCategoryDto, @UploadedFile(
        createParseFilePipe('2MB', ['jpeg', 'png', 'jpg'], true)
    ) file: Express.Multer.File): Promise<Subcategory> {
        return await this.subcategoryService.createSubCategory(categoryId, createSubCategoryDto, file)
    }

    @Put(':subcategoryId')
    @UseInterceptors(FileInterceptor('file'))
    async updateSubCategory(@Param('categoryId', ParseObjectIdPipe) categoryId: string, @Param('subcategoryId', ParseObjectIdPipe) subcategoryId: string, @Body() updateSubCategoryDto: UpdateSubCategoryDto, @UploadedFile(
        createParseFilePipe('2MB', ['jpeg', 'png', 'jpg'], false)
    ) file: Express.Multer.File): Promise<Subcategory> {
        console.log(updateSubCategoryDto);
        
        return await this.subcategoryService.updateSubCategory(categoryId, subcategoryId, updateSubCategoryDto, file)
    } 
}
