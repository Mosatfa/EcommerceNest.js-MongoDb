import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Brand } from 'src/brand/schema/brand.schema';
import { Subcategory } from 'src/subcategory/schema/subcategory.schema';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { CustomRequest } from 'src/common/interfaces/custom-request.interface';


@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(Brand.name) private brandModel: Model<Brand>,
        @InjectModel(Subcategory.name) private subcategoryModel: Model<Subcategory>,
        private cloudinaryService: CloudinaryService
    ) { }


    async createProduct(req: CustomRequest, createProductDto: CreateProductDto, files: any): Promise<Product> {
        const { name, price, discount, categoryId, subcategoryId, brandId } = createProductDto

        //check category and brand
        if (!await this.subcategoryModel.findOne({ _id: subcategoryId, categoryId })) {
            throw new BadRequestException(`Invalid subcategoryId or categoryId`)
        }
        if (!await this.brandModel.findById(brandId)) {
            throw new BadRequestException(`In-Valid brand Id`)
        }

        // upload mainImage
        const customId = uuidv4()
        const { secure_url, public_id } = await this.cloudinaryService.uploadFile(files.mainImage[0], `product/${customId}`)


        // Upload subImages if present
        const subImages = [];
        if (files.subImages) {
            const uploadPromises = files.subImages.map(async (file) => {
                const { secure_url, public_id } = await this.cloudinaryService.uploadFile(file, `product/${customId}/subImages`);
                subImages.push({ secure_url, public_id });
            });
            await Promise.all(uploadPromises);
        }

        // Calculate finalPrice
        const finalPrice = Number(price - (price * ((discount || 0) / 100))).toFixed(2)

        const productData = {
            ...createProductDto,
            customId,
            slug: slugify(name, { lower: true, strict: true }), // create Slug
            finalPrice,
            mainImage: { secure_url, public_id },
            subImages,
            createdBy: req.user._id
        } 
        const product = await this.productModel.create(productData);

        return product
    }


    async updateProduct(req: CustomRequest, productId: string, UpdateProductDto?: UpdateProductDto, files?: any): Promise<Product> {
        const { name, price, discount, colors, size } = UpdateProductDto;

        const product = await this.productModel.findById(productId)
        if (!product) {
            throw new BadRequestException(`In-Valid product Id`)
        }
        const productData: any = {
            ...UpdateProductDto
        };

        if (name) {
            productData.name = name
            productData.slug = slugify(name, { lower: true, trim: true, strict: true })
        }

        if (colors?.length) {
            UpdateProductDto.colors.map(color => product.colors.push(color))
            productData.colors = product.colors
        }

        if (size?.length) {
            UpdateProductDto.colors.map(size => product.size.push(size))
            productData.size = product.size
        }

        if (discount && price) {
            productData.finalPrice = Number(price - (price * ((discount || 0) / 100))).toFixed(2)
        } else if (price) {
            productData.finalPrice = Number(price - (price * ((product.discount) / 100))).toFixed(2)
        } else if (discount) {
            productData.finalPrice = Number((Number(product.price) - (Number(product.price) * (discount / 100))).toFixed(2));
        }


        // upload mainImage
        if (files.mainImage?.length) {
            const { secure_url, public_id } = await this.cloudinaryService.uploadFile(files.mainImage[0], `product/${product.customId}`)
            await this.cloudinaryService.destroy(product.mainImage.public_id)
            productData.mainImage = { secure_url, public_id }
        }

        //Upload subImages if present
        if (files.subImages?.length) {
            const subImagies = [];
            for (const file of files.subImages) {
                const { secure_url, public_id } = await this.cloudinaryService.uploadFile(file, `product/${product.customId}/subImages`);
                for (let i = 0; i < product.subImages.length; i++) {
                    await this.cloudinaryService.destroy(product.subImages[i].public_id)
                }
                subImagies.push({ secure_url, public_id })
            }
            productData.subImages = subImagies
        }
     
        productData.updatedBy = req.user._id

        const newProduct = await this.productModel.findByIdAndUpdate({ _id: product._id }, productData)

        return newProduct
    };
}
