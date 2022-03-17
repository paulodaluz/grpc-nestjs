import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { UserService } from '../interfaces/user.interface';
import { Product } from '../interfaces/product.interface';

@Injectable()
export class ProductsService implements OnModuleInit {
  private userService: UserService;

  private productsMock = [
    {
      name: 'Chromecast 3 Streaming Device Google - Full HD Conexão HDMI',
      value: 'R$ 305,97',
    },
    {
      name: 'Kit Teclado e Mouse Sem Fio Logitech MK270',
      value: 'R$ 204,59',
    }
  ];

  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  async getProductsByUser(id: string): Promise<Array<Product>> {
    const user = await this.userService.getUser({ id }).toPromise();

    return this.getProductsByCPF(user.cpf);
  }

  getProductsByCPF(cpf: string): Array<Product> {
    if(cpf === '472.086.230-66') {
      return this.productsMock;
    }

    return;
  }
}

