import { IProductService } from './interfaces/product.interface';
import { ProductService } from './product.service';
import { Body, Controller, Param, Post, Put, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { Product } from './schema/product.schema';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { createParseFilePipe } from 'src/common/files/files-validation-factory';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) { }

    async getProducts(): Promise<Product[]> {
        return
    };

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },
    ]))
    async createProduct(@Body() createProductDto:CreateProductDto, @UploadedFiles() files: { mainImage: Express.Multer.File[], subImages?: Express.Multer.File[] }
    ): Promise<Product> {
        console.log(createProductDto,files);
        return await this.productService.createProduct(createProductDto, files)
    };

    @Put(':productId')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },
    ]))
    async updateProduct(@Param('productId') productId:string,@Body() updateProductDto:UpdateProductDto, @UploadedFiles() files: { mainImage?: Express.Multer.File, subImages?: Express.Multer.File[] }
    ): Promise<Product> {
        return await this.productService.updateProduct(productId,updateProductDto, files)
    };


}

