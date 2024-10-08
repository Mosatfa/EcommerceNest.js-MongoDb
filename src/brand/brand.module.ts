import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { Brand, BrandSchema } from './schema/brand.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }])],
  controllers: [BrandController],
  providers: [BrandService, CloudinaryService]
})
export class BrandModule { }
