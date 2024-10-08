import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Subcategory, SubcategorySchema } from 'src/subcategory/schema/subcategory.schema';
import { Brand, BrandSchema } from 'src/brand/schema/brand.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Product.name, schema: ProductSchema },
    { name: Brand.name, schema: BrandSchema },
    { name: Subcategory.name, schema: SubcategorySchema }
  ])],
  controllers: [ProductController],
  providers: [ProductService, CloudinaryService]
})
export class ProductModule { }
