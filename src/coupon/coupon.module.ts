import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, CouponSchema } from './schema/coupon.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Coupon.name, schema: CouponSchema },
    { name: User.name, schema: UserSchema }
  ])],
  controllers: [CouponController],
  providers: [CouponService, CloudinaryService, JwtService, UserService]
})
export class CouponModule { }
