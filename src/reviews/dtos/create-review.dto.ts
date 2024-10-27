import { IsInt, IsNotEmpty, IsObject, IsString, Length, Max, Min } from "class-validator";

export class CreateReviewDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 200)
    comment: string;

    @IsInt({ message: 'Rating must be an integer.' })
    @Min(1, { message: 'Rating must be at least 1.' })
    @Max(5, { message: 'Rating cannot exceed 5.' })
    rating: number; 
}