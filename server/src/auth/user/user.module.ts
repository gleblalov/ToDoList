// import { Module, forwardRef } from '@nestjs/common';
// import { PassportModule } from '@nestjs/passport';
// import { UserController } from './user.controller';
// import { UserService } from './user.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Users } from '../../entities/users.model';



// @Module({
//   imports: [
//     TypeOrmModule.forFeature([Users]),
//     PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    
//   ],
//   exports: [UserService],
//   controllers: [UserController],
//   providers: [UserService]
// })
// export class UserModule {}