import { CustomRequest } from "src/common/interfaces/custom-request.interface";
import { Review } from "../schema/review.schema";
import { CreateReviewDto } from "../dtos/create-review.dto";
import { UpdateReviewDto } from "../dtos/update-review.dto";


export interface IReviewService {
    createReview(productId: string, req: CustomRequest, createReviewDto: CreateReviewDto): Promise<Review>
    updateReview(reviewId: string, req: CustomRequest, updateReviewDto: UpdateReviewDto): Promise<Review>
}