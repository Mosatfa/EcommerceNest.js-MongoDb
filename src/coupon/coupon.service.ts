import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ICouponService } from './interfaces/coupon.interface';
import { Coupon } from './schema/coupon.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCouponDto } from './dtos/create-coupon.dto';
import { UpdateCouponDto } from './dtos/update-coupon.dto';
import { CustomRequest } from 'src/common/interfaces/custom-request.interface';

@Injectable()
export class CouponService implements ICouponService {
    constructor(
        @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
        private cloudinaryService: CloudinaryService
    ) { }

    async getCoupons(): Promise<Coupon[]> {
        const coupon = await this.couponModel.find({})
        return coupon
    };

    async createCoupon(req: CustomRequest,createCouponDto: CreateCouponDto): Promise<Coupon> {
        const normalizedName = createCouponDto.name.toUpperCase();
        // Check if coupon with the normalized name already exists
        if (await this.couponModel.findOne({ name: normalizedName })) {
            throw new ConflictException(`Duplicate Coupon name: ${normalizedName}`);
        }

        // Convert expireDate from string to Date
        createCouponDto.expireDate = new Date(createCouponDto.expireDate);
        
        const coupon = await this.couponModel.create({
            ...createCouponDto,
            createdBy: req.user._id
        });
        return coupon
    };

    async updateCoupon(req: CustomRequest,couponId: string, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
        const coupon = await this.couponModel.findById(couponId)
        if (!coupon) {
            throw new NotFoundException(`Coupon with ID ${couponId} not found.`)
        }

        if (updateCouponDto.name) {
            const newName = updateCouponDto.name.toUpperCase()
            if (coupon.name == newName) {
                throw new ConflictException(`Sorry can't update because The new name is the same as the old one`)
            }
            if (await this.couponModel.findOne({ name: newName })) {
                throw new ConflictException(`Duplicate coupon name ${newName}`)
            }
            coupon.name = newName
        }
        if (updateCouponDto.amount) {
            coupon.amount = updateCouponDto.amount
        }
        if (updateCouponDto.expireDate) {
            coupon.expireDate = new Date(updateCouponDto.expireDate)
        }

        coupon.updatedBy = req.user._id
        coupon.save()
        return coupon
    };
}
