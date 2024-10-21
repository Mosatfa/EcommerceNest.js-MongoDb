import { BrandService } from './brand.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { IBrandService } from './interfaces/brand.interface';
import { Brand } from './schema/brand.schema';
import { CreateBrandDto } from './dtos/create-brand.dto';
import { UpdateBrandDto } from './dtos/update-brand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createParseFilePipe } from 'src/common/files/files-validation-factory';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-objectid.pipe';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CustomRequest } from 'src/common/interfaces/custom-request.interface';

@Controller('brand')
export class BrandController implements IBrandService {
    constructor(private brandService: BrandService) { }

    @Get()
    async getBrands(): Promise<Brand[]> {
        return await this.brandService.getBrands()
    };

    @Post()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('file'))
    async createBrand(@Req() req: CustomRequest,@Body() createBrandDto: CreateBrandDto, @UploadedFile(
        createParseFilePipe('2MB', ['jpeg', 'png', 'jpg'], true)
    ) file: Express.Multer.File): Promise<Brand> {
        return await this.brandService.createBrand(req,createBrandDto, file)
    };

    @Put(':brandId')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('file'))
    async updateBrand(@Req() req: CustomRequest,@Param('brandId', ParseObjectIdPipe) brandId: string, @Body() updateBrandDto: UpdateBrandDto, @UploadedFile(
        createParseFilePipe('2MB', ['jpeg', 'png', 'jpg'], false)
    ) file?: Express.Multer.File): Promise<Brand> {
        return await this.brandService.updateBrand(req,brandId, updateBrandDto, file)
    };
}
