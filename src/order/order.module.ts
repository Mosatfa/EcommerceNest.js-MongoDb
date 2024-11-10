import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { Cart, CartSchema } from 'src/cart/schema/cart.schema';
import { Product, ProductSchema } from 'src/product/schema/product.schema';
import { Coupon, CouponSchema } from 'src/coupon/schema/coupon.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { StripeService } from 'src/stripe/stripe.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Coupon.name, schema: CouponSchema },
      { name: Order.name, schema: OrderSchema },
    ])
  ],
  controllers: [OrderController],
  providers: [OrderService, JwtService, UserService ,StripeService]
})
export class OrderModule { }
