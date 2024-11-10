import { CreateSubCategoryDto } from './dtos/create-subcategory.dto';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Subcategory } from './schema/subcategory.schema';
import { UpdateSubCategoryDto } from './dtos/update-subcategory.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createParseFilePipe } from 'src/common/files/files-validation-factory';
import { IsubCategoryService } from './interfaces/subcategory.interface';
import { SubcategoryService } from './subcategory.service';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-objectid.pipe';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorator/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CustomRequest } from 'src/common/interfaces/custom-request.interface';

@Controller('category/:categoryId/subcategory')
export class SubcategoryController implements IsubCategoryService {
    constructor(private subcategoryService: SubcategoryService) { }

    @Get()
    async getSubcategory(): Promise<Subcategory[]> {
        return await this.getSubcategory()
    }

    @Post()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('file'))
    async createSubCategory(@Req() req: CustomRequest, @Param('categoryId', ParseObjectIdPipe) categoryId: string, @Body() createSubCategoryDto: CreateSubCategoryDto, @UploadedFile(
        createParseFilePipe('2MB', ['jpeg', 'png', 'jpg'], true)
    ) file: Express.Multer.File): Promise<Subcategory> {
        return await this.subcategoryService.createSubCategory(req,categoryId, createSubCategoryDto, file)
    }

    @Put(':subcategoryId')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('file'))
    async updateSubCategory(@Req() req: CustomRequest, @Param('categoryId', ParseObjectIdPipe) categoryId: string, @Param('subcategoryId', ParseObjectIdPipe) subcategoryId: string, @Body() updateSubCategoryDto: UpdateSubCategoryDto, @UploadedFile(
        createParseFilePipe('2MB', ['jpeg', 'png', 'jpg'], false)
    ) file: Express.Multer.File): Promise<Subcategory> {
        return await this.subcategoryService.updateSubCategory(req,categoryId, subcategoryId, updateSubCategoryDto, file)
    }

    @Delete(':subCategoryId')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    async deleteSubCategory(@Param('subCategoryId', ParseObjectIdPipe) subCategoryId: string): Promise<{ message: string }> {
        return await this.subcategoryService.deleteSubCategory(subCategoryId)
    }
}
