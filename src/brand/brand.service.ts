import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './schema/brand.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Model } from 'mongoose';
import { CreateBrandDto } from './dtos/create-brand.dto';
import { UpdateBrandDto } from './dtos/update-brand.dto';
import { IBrandService } from './interfaces/brand.interface';

@Injectable()
export class BrandService implements IBrandService{
    constructor(
        @InjectModel(Brand.name) private brandModel: Model<Brand>,
        private cloudinaryService: CloudinaryService
    ) { }

    async getBrands(): Promise<Brand[]> {
        const brands = await this.brandModel.find({})
        return brands
    }

    async createBrand(createBrandDto: CreateBrandDto, file: Express.Multer.File): Promise<Brand> {
        const name = createBrandDto.name.toLowerCase();

        // Check if a brand with the same name already exists
        if (await this.brandModel.findOne({ name })) {
            throw new ConflictException(`Duplicate Brand name: ${name}`)
        }
        // Upload the logo image to Cloudinary
        const { secure_url, public_id } = await this.cloudinaryService.uploadFile(file, 'brand')

        // Create the new brand in the database
        const newBrand = await this.brandModel.create({
            name,
            logo: { secure_url, public_id },
            // createdBy,
        })
        return newBrand
    }

    async updateBrand(brandId: string, updateBrandDto: UpdateBrandDto, file?: Express.Multer.File): Promise<Brand> {
        const brand = await this.brandModel.findById(brandId)
        if (!brand) {
            throw new NotFoundException(`Brand with ID ${brandId} not found`)
        }

        if (updateBrandDto.name) {
            const newName = updateBrandDto.name.toLowerCase()
            if (brand.name == newName) {
                throw new ConflictException(`Sorry, can't update because the new name is the same as the old one`);
            }
            if (await this.brandModel.findOne({ name: newName })) {
                throw new ConflictException(`Duplicate Brand name: ${newName}`);
            }
            brand.name = newName
        }
        if (file) {
            const { secure_url, public_id } = await this.cloudinaryService.uploadFile(file, 'brand')
            await this.cloudinaryService.destroy(brand.logo.public_id)
            brand.logo = { secure_url, public_id }
        }
        // brand.updatedBy 
        brand.save()
        return brand
    }
}
