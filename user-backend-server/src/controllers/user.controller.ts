import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Body, Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { User } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'GetUser')
  getUserByGrpc(
    data: { id: string },
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): User {
    return this.userService.getUser(data.id);
  }

  @Get('get-user')
  getUserByHttp(@Body() data: { id: string }): User {
    return this.userService.getUser(data.id);
  }
}
