import { CustomRequest } from "src/common/interfaces/custom-request.interface";
import { CreateProductDto } from "../dtos/create-product.dto";
import { UpdateProductDto } from "../dtos/update-product.dto";
import { Product } from "../schema/product.schema";


export interface IProductService {
  getProducts(): Promise<Product[]>;
  createProduct(req:CustomRequest,createProductDto: CreateProductDto, files: { mainImage: Express.Multer.File, subImages?: Express.Multer.File[] }): Promise<Product>;
  updateProduct(req:CustomRequest,productId: string, updateProductDto?: UpdateProductDto, files?: { mainImage?: Express.Multer.File, subImages?: Express.Multer.File[] }): Promise<Product>;
}
