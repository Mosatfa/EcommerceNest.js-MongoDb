import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { Brand, BrandSchema } from './schema/brand.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/user/schema/user.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Brand.name, schema: BrandSchema },
    { name: User.name, schema: UserSchema }
  ])],
  controllers: [BrandController],
  providers: [BrandService, CloudinaryService, JwtService, UserService]
})
export class BrandModule { }
