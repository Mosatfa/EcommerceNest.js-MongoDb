import { CustomRequest } from "src/common/interfaces/custom-request.interface";
import { CreateBrandDto } from "../dtos/create-brand.dto";
import { UpdateBrandDto } from "../dtos/update-brand.dto";
import { Brand } from "../schema/brand.schema";


export interface IBrandService {
    getBrands(): Promise<Brand[]>;
    createBrand(req: CustomRequest, createBrandDto: CreateBrandDto, file: Express.Multer.File): Promise<Brand>;
    updateBrand(req: CustomRequest, brandId: string, updateBrandDto: UpdateBrandDto, file?: Express.Multer.File): Promise<Brand>;
    deleteBrand(brandId: string): Promise<{ message: string }>
}