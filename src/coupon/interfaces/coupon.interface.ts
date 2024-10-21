import { CustomRequest } from "src/common/interfaces/custom-request.interface";
import { CreateCouponDto } from "../dtos/create-coupon.dto";
import { UpdateCouponDto } from "../dtos/update-coupon.dto";
import { Coupon } from "../schema/coupon.schema";


export interface ICouponService {
    getCoupons(): Promise<Coupon[]>;
    createCoupon(req:CustomRequest,createCouponDto: CreateCouponDto): Promise<Coupon>;
    updateCoupon(req:CustomRequest,couponId: string, updateCouponDto: UpdateCouponDto): Promise<Coupon>;
}