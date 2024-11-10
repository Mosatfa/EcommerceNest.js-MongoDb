import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, Session, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Coupon } from './schema/coupon.schema';
import { CreateCouponDto } from './dtos/create-coupon.dto';
import { UpdateCouponDto } from './dtos/update-coupon.dto';
import { CouponService } from './coupon.service';
import { ICouponService } from './interfaces/coupon.interface';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-objectid.pipe';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CustomRequest } from 'src/common/interfaces/custom-request.interface';
import { ApplyCouponDto } from './dtos/apply-coupon.dto';
import { Cart } from 'src/cart/schema/cart.schema';


@Controller('coupon')
export class CouponController implements ICouponService {
    constructor(private couponService: CouponService) { }

    @Get()
    async getCoupons(): Promise<Coupon[]> {
        return await this.couponService.getCoupons()
    };

    @Post()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.CREATED)
    async createCoupon(@Req() req: CustomRequest, @Body() createCouponDto: CreateCouponDto): Promise<Coupon> {
        return await this.couponService.createCoupon(req, createCouponDto)
    };


    @Put(':couponId')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    async updateCoupon(@Req() req: CustomRequest, @Param('couponId', ParseObjectIdPipe) couponId: string, @Body() updateCouponDto: UpdateCouponDto): Promise<Coupon> {
        return await this.couponService.updateCoupon(req, couponId, updateCouponDto)
    };


    @Post('apply')
    @HttpCode(HttpStatus.OK)
    async applyCoupon(@Session() session: Record<string, any>, @Body() applyCouponDto: ApplyCouponDto): Promise<Cart> {
        return await this.couponService.applyCoupon(session,applyCouponDto)
    };

    @Delete(':couponId')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    async deleteCoupon(@Param('couponId', ParseObjectIdPipe) couponId: string): Promise<{ message: string }> {
        return await this.couponService.deleteCoupon(couponId)
    }
}
