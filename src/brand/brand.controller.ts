import { BrandService } from './brand.service';
import { Body, Controller, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { IBrandService } from './interfaces/brand.interface';
import { Brand } from './schema/brand.schema';
import { CreateBrandDto } from './dtos/create-brand.dto';
import { UpdateBrandDto } from './dtos/update-brand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createParseFilePipe } from 'src/common/files/files-validation-factory';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-objectid.pipe';

@Controller('brand')
export class BrandController implements IBrandService {
    constructor(private brandService: BrandService) { }

    @Get()
    async getBrands(): Promise<Brand[]> {
        return await this.brandService.getBrands()
    };

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async createBrand(@Body() createBrandDto: CreateBrandDto, @UploadedFile(
        createParseFilePipe('2MB', ['jpeg', 'png', 'jpg'], true)
    ) file: Express.Multer.File): Promise<Brand> {
        return await this.brandService.createBrand(createBrandDto, file)
    };

    @Put(':brandId')
    @UseInterceptors(FileInterceptor('file'))
    async updateBrand(@Param('brandId', ParseObjectIdPipe) brandId: string, @Body() updateBrandDto: UpdateBrandDto, @UploadedFile(
        createParseFilePipe('2MB', ['jpeg', 'png', 'jpg'], false)
    ) file?: Express.Multer.File): Promise<Brand> {
        return await this.brandService.updateBrand(brandId, updateBrandDto, file)
    };
}
