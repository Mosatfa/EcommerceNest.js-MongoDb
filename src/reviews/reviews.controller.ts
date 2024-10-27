import { ReviewsService } from './reviews.service';
import { Body, Controller, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CustomRequest } from 'src/common/interfaces/custom-request.interface';
import { CreateReviewDto } from './dtos/create-review.dto';
import { Review } from './schema/review.schema';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-objectid.pipe';
import { IReviewService } from './interfaces/review.interface';

@Controller('reviews')
export class ReviewsController implements IReviewService {
    constructor(
        private reviewsService: ReviewsService
    ) { }

    @Post(':productId')
    @Roles(Role.User)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.CREATED)
    async createReview(@Param('productId', ParseObjectIdPipe) productId: string, @Req() req: CustomRequest, @Body() createReviewDto: CreateReviewDto): Promise<Review> {
        return await this.reviewsService.createReview(productId, req, createReviewDto)
    }

    @Put(':reviewId')
    @Roles(Role.User)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    async updateReview(@Param('reviewId', ParseObjectIdPipe) reviewId: string, @Req() req: CustomRequest, @Body() updateReviewDto: UpdateReviewDto): Promise<Review> {
        return await this.reviewsService.updateReview(reviewId, req, updateReviewDto)
    }
}
