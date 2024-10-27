import { CustomRequest } from "src/common/interfaces/custom-request.interface";
import { CreateCouponDto } from "../dtos/create-coupon.dto";
import { UpdateCouponDto } from "../dtos/update-coupon.dto";
import { Coupon } from "../schema/coupon.schema";
import { ApplyCouponDto } from "../dtos/apply-coupon.dto";
import { Cart } from "src/cart/schema/cart.schema";


export interface ICouponService {
    getCoupons(): Promise<Coupon[]>;
    createCoupon(req:CustomRequest,createCouponDto: CreateCouponDto): Promise<Coupon>;
    updateCoupon(req:CustomRequest,couponId: string, updateCouponDto: UpdateCouponDto): Promise<Coupon>;
    applyCoupon(session: Record<string, any>, applyCouponDto: ApplyCouponDto): Promise<Cart>
}