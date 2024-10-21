import { IProductService } from './interfaces/product.interface';
import { ProductService } from './product.service';
import { Body, Controller, HttpCode, HttpStatus, Param, Post, Put, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { Product } from './schema/product.schema';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { createParseFilePipe } from 'src/common/files/files-validation-factory';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CustomRequest } from 'src/common/interfaces/custom-request.interface';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) { }

    async getProducts(): Promise<Product[]> {
        return
    };

    @Post()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },
    ]))
    async createProduct(@Req() req: CustomRequest,@Body() createProductDto:CreateProductDto, @UploadedFiles() files: { mainImage: Express.Multer.File[], subImages?: Express.Multer.File[] }
    ): Promise<Product> {
        return await this.productService.createProduct(req,createProductDto, files)
    };

    @Put(':productId')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },
    ]))
    async updateProduct(@Req() req: CustomRequest,@Param('productId') productId:string,@Body() updateProductDto:UpdateProductDto, @UploadedFiles() files: { mainImage?: Express.Multer.File, subImages?: Express.Multer.File[] }
    ): Promise<Product> {
        return await this.productService.updateProduct(req,productId,updateProductDto, files)
    };


}

