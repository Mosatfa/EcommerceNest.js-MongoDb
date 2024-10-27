import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CustomRequest } from 'src/common/interfaces/custom-request.interface';
import { CreateReviewDto } from './dtos/create-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from 'src/order/schema/order.schema';
import { Model } from 'mongoose';
import { Product } from 'src/product/schema/product.schema';
import { Review } from './schema/review.schema';
import { UpdateReviewDto } from './dtos/update-review.dto';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectModel(Review.name) private reviewModel: Model<Review>,
        @InjectModel(Order.name) private orderModel: Model<Order>,
        @InjectModel(Product.name) private productModel: Model<Product>,
    ) { }

    async createReview(productId: string, req: CustomRequest, createReviewDto: CreateReviewDto): Promise<Review> {
        const { comment, rating } = createReviewDto;

        // Check if the user has a delivered order for the product
        const order = await this.orderModel.findOne({
            userId: req.user._id,
            status: "delivered",
            "products.productId": productId
        });

        if (!order) {
            throw new BadRequestException('Cannot review product before receiving it');
        }

        // Check if the user has already reviewed this product
        const existingReview = await this.reviewModel.findOne({
            createdBy: req.user._id,
            productId,
            orderId: order._id
        });

        if (existingReview) {
            throw new BadRequestException('You have already reviewed this product');
        }

        // Create the review
        const review = await this.reviewModel.create({
            comment,
            rating,
            createdBy: req.user._id,
            orderId: order._id,
            productId
        });

        return review;
    }

    async updateReview(reviewId: string, req: CustomRequest, updateReviewDto: UpdateReviewDto): Promise<Review> {
        const review = await this.reviewModel.findOneAndUpdate(
            { _id: reviewId, createdBy: req.user._id },
            updateReviewDto,
            { new: true }
        );

        if (!review) {
            throw new NotFoundException('Invalid Review Id');
        }

        return review;
    }
}
