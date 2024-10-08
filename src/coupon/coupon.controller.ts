import { Body, Controller, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Coupon } from './schema/coupon.schema';
import { CreateCouponDto } from './dtos/create-coupon.dto';
import { UpdateCouponDto } from './dtos/update-coupon.dto';
import { CouponService } from './coupon.service';
import { ICouponService } from './interfaces/coupon.interface';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-objectid.pipe';


@Controller('coupon')
export class CouponController implements ICouponService {
    constructor(private couponService: CouponService) { }

    @Get()
    async getCoupons(): Promise<Coupon[]> {
        return await this.couponService.getCoupons()
    };

    @Post()
    async createCoupon(@Body() createCouponDto: CreateCouponDto): Promise<Coupon> {
        return await this.couponService.createCoupon(createCouponDto)
    };

    @Put(':couponId')
    async updateCoupon(@Param('couponId',ParseObjectIdPipe) couponId: string, @Body() updateCouponDto: UpdateCouponDto): Promise<Coupon> {
        return await this.couponService.updateCoupon(couponId, updateCouponDto)
    };
}
