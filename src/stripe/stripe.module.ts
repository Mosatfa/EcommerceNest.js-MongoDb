import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Order, OrderSchema } from 'src/order/schema/order.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: Order.name, schema: OrderSchema },
  ])],
  controllers: [StripeController],
  providers: [StripeService, JwtService, UserService]
})
export class StripeModule { }
