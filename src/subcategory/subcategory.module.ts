import { Module } from '@nestjs/common';
import { SubcategoryController } from './subcategory.controller';
import { SubcategoryService } from './subcategory.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Subcategory, SubcategorySchema } from './schema/subcategory.schema';
import { Category, CategorySchema } from 'src/category/schema/category.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subcategory.name, schema: SubcategorySchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [SubcategoryController],
  providers: [SubcategoryService,CloudinaryService]
})
export class SubcategoryModule { }
