import { CreateBrandDto } from "../dtos/create-brand.dto";
import { UpdateBrandDto } from "../dtos/update-brand.dto";
import { Brand } from "../schema/brand.schema";


export interface IBrandService {
    getBrands(): Promise<Brand[]>;
    createBrand(createBrandDto: CreateBrandDto, file: Express.Multer.File): Promise<Brand>;
    updateBrand(brandId: string, updateBrandDto: UpdateBrandDto, file?: Express.Multer.File): Promise<Brand>;
}