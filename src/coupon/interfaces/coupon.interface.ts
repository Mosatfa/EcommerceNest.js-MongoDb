import { CreateCouponDto } from "../dtos/create-coupon.dto";
import { UpdateCouponDto } from "../dtos/update-coupon.dto";
import { Coupon } from "../schema/coupon.schema";


export interface ICouponService {
    getCoupons(): Promise<Coupon[]>;
    createCoupon(createCouponDto: CreateCouponDto): Promise<Coupon>;
    updateCoupon(couponId: string, updateCouponDto: UpdateCouponDto): Promise<Coupon>;
}