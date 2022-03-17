import { Module } from '@nestjs/common';
import { join } from 'path';
import { ProductsController } from '../controllers/app.controller';
import { ProductsService } from '../services/app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50051',
          package: 'user',
          protoPath: join(__dirname, '../proto/user.proto'),
        },
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class AppModule {}
