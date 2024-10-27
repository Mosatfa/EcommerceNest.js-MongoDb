import { IProductService } from './interfaces/product.interface';
import { ProductService } from './product.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
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
export class ProductController implements IProductService {
    constructor(private productService: ProductService) { }

    @Get()
    @HttpCode(HttpStatus.CREATED)
    async getProducts(@Query() query:any): Promise<{ products: Product[] }> {
        return await this.productService.getProducts(query)
    };

    @Post()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },
    ]))
    async createProduct(@Req() req: CustomRequest, @Body() createProductDto: CreateProductDto, @UploadedFiles() files: { mainImage: Express.Multer.File, subImages?: Express.Multer.File[] }
    ): Promise<Product> {
        return await this.productService.createProduct(req, createProductDto, files)
    };

    @Put(':productId')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },
    ]))
    async updateProduct(@Req() req: CustomRequest, @Param('productId') productId: string, @Body() updateProductDto: UpdateProductDto, @UploadedFiles() files: { mainImage?: Express.Multer.File, subImages?: Express.Multer.File[] }
    ): Promise<Product> {
        return await this.productService.updateProduct(req, productId, updateProductDto, files)
    };

    @Patch(':productId')
    @Roles(Role.User)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    async addWishList(@Req() req: CustomRequest, @Param('productId') productId: string): Promise<{ message: string }> {
        return await this.productService.addWishList(req, productId)
    };

    @Delete(':productId')
    @Roles(Role.User)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    async removeWishList(@Req() req: CustomRequest, @Param('productId') productId: string) {
        return await this.productService.removeWishList(req, productId);
    }


}

