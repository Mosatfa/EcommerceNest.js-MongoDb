import { CategoryService } from './category.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Category } from './schema/category.schema';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createParseFilePipe } from 'src/common/files/files-validation-factory';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-objectid.pipe';
import { ICategoryService } from './interfaces/category.interface';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Request } from 'express';
import { CustomRequest } from 'src/common/interfaces/custom-request.interface';

@Controller('category')
export class CategoryController implements ICategoryService {
    constructor(private categoryService: CategoryService) { }
    @Get()
    @HttpCode(200)
    async getCategory(): Promise<Category[]> {
        return await this.categoryService.getCategory();
    }

    @Post()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('file'))
    async createCategory(@Req() req: CustomRequest, @Body() createCategoryDto: CreateCategoryDto, @UploadedFile(
        createParseFilePipe('2MB', ['jpeg', 'png', 'jpg'], true)
    ) file: Express.Multer.File): Promise<Category> {
        return await this.categoryService.createCategory(req, createCategoryDto, file)
    }

    @Put(':categoryId')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('file'))
    async updateCategory(@Req() req: CustomRequest, @Param('categoryId', ParseObjectIdPipe) categoryId: string, @Body() updateCategoryDto: UpdateCategoryDto, @UploadedFile(
        createParseFilePipe('2MB', ['jpeg', 'png', 'jpg'], false)
    ) file: Express.Multer.File): Promise<Category> {
        return await this.categoryService.updateCategory(req,categoryId, updateCategoryDto, file)
    }
}
