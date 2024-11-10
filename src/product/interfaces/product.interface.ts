import { CustomRequest } from "src/common/interfaces/custom-request.interface";
import { CreateProductDto } from "../dtos/create-product.dto";
import { UpdateProductDto } from "../dtos/update-product.dto";
import { Product } from "../schema/product.schema";


export interface IProductService {
  getProducts(query: any): Promise<{ products: Product[] }>
  createProduct(req: CustomRequest, createProductDto: CreateProductDto, files: { mainImage: Express.Multer.File, subImages?: Express.Multer.File[] }): Promise<Product>;
  updateProduct(req: CustomRequest, productId: string, updateProductDto?: UpdateProductDto, files?: { mainImage?: Express.Multer.File, subImages?: Express.Multer.File[] }): Promise<Product>;
  deleteProduct(productId: string): Promise<{ message: string }>
  addWishList(req: CustomRequest, productId: string): Promise<{ message: string }>
  removeWishList(req: CustomRequest, productId: string): Promise<{ message: string }>
}
