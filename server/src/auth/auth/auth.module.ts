import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from '../jwt.strategy';
import { Users } from '../../entities/users.model';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Users]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: '301195',
      signOptions: {
        // expiresIn: 3600
      }
    }),
    
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule { }


// secretOrPrivateKey: '301195',