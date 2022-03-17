import { Injectable } from '@nestjs/common';
import { User } from '../interfaces/user.interface';

@Injectable()
export class UserService {
  private userMock = {
    id: 'bf65986e-7946-456c-bc98-c7dedeca71f6',
    cpf: '472.086.230-66',
    name: 'Luis Carlos',
    address: 'Via Eixo Principal',
  };

  getUser(id: string): User {
    if (id === 'bf65986e-7946-456c-bc98-c7dedeca71f6') {
      return this.userMock;
    }

    return;
  }
}
