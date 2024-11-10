import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { DbModule } from './db/db.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { BrandModule } from './brand/brand.module';
import { CouponModule } from './coupon/coupon.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './auth/service/generate&VerifyToken.service';
import { MailModule } from './mail/mail.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { ReviewsModule } from './reviews/reviews.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        MONGO_URI: Joi.string().required(),
      }),
      isGlobal: true
    }),
    JwtModule,
    CategoryModule,
    SubcategoryModule,
    DbModule,
    CloudinaryModule,
    BrandModule,
    CouponModule,
    ProductModule,
    AuthModule,
    UserModule,
    MailModule,
    CartModule,
    OrderModule,
    ReviewsModule,
    StripeModule
  ],
  controllers: [AppController],
  providers: [AppService, TokenService],
})
export class AppModule { }
