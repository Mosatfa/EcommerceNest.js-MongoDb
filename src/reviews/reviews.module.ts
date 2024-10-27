import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Order, OrderSchema } from 'src/order/schema/order.schema';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Product, ProductSchema } from 'src/product/schema/product.schema';
import { Review, ReviewSchema } from './schema/review.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Review.name, schema: ReviewSchema },
    { name: Order.name, schema: OrderSchema },
    { name: User.name, schema: UserSchema },
    { name: Product.name, schema: ProductSchema },
  ])],
  controllers: [ReviewsController],
  providers: [ReviewsService, JwtService, UserService]
})
export class ReviewsModule {}
