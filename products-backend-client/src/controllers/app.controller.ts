import { Controller, Get, Param } from '@nestjs/common';
import { Product } from 'src/interfaces/product.interface';
import { ProductsService } from '../services/app.service';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products/:userId')
  getproducts(@Param('userId') userId: string): Promise<Array<Product>> {
    return this.productsService.getProductsByUser(userId);
  }
}
