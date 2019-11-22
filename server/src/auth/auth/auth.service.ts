import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository, ObjectID, AdvancedConsoleLogger } from 'typeorm';

import * as crypto from 'crypto';

import { Users, } from '../../entities';
import { User, SocialUser } from '../../model';

import {getRepository} from "typeorm";


@Injectable()
export class AuthService {
    userData: any;
    constructor(
        @InjectRepository(Users) private userRepository: Repository<Users>,
        private jwtService: JwtService
    ) { }

    private async validate(user: User): Promise<User> {
        return await this.findByLogin(user.login);
    }

    public async login(user: User): Promise<any | { status: number }> {
        return this.validate(user).then((res) => {
            user.password = crypto.createHmac('sha256', user.password).digest('hex');;
            if (!user) {
                return { status: 404 };
            }
            if (user.password !== res.password) {
                return { status: 404 };
            }
            return this.createJwtPayload(res);

        });
    }

    // async getUserById(id) {
    //     return await this.findById(id);
    // }

    async validateUserByJwt(payload) {

        let user = await this.findByLogin(payload.login);

        if (user) {
            return this.createJwtPayload(user);
        } else {
            throw new UnauthorizedException();
        }
    }

    createJwtPayload(user) {
        let payload = `${user.id}`;
        const jwt = this.jwtService.sign(payload);

        return {
            expiresIn: 3600,
            token: jwt,
            id: payload,
            status: 200
        };
    }

    async registration(user: User): Promise<any> {
        user.password = crypto.createHmac('sha256', user.password).digest('hex');
        await this.userRepository.save(user);
        return this.createJwtPayload(user);
    }

    async registrationSocial(user: any): Promise<any> {
        
        const findUser = await this.findByEmail(user.email);
        if(findUser){
            return await this.createJwtPayload(findUser);
        }
        if (!findUser) {
            const userData = await this.userRepository.save(user)

            return await this.createJwtPayload(userData);
        }
    }
    
    // async changeUser(id: ObjectID, user: SocialUser) {
    //     return await this.userRepository.update(id, user);
    //   }

    async changeUserImage(id: ObjectID, imageName: string){
    
        const user = await this.findById(id);
        user.imageUrl = imageName;

        return await this.userRepository.save(user);
    }

    async findByLogin(login: string): Promise<User> {
        return await this.userRepository.findOne({
            where: {
                login: login,
            }
        });
    }

    async findByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({
            where: {
                email: email,
            }
        });
    }

    async findById(id: ObjectID): Promise<User> {
        return await this.userRepository.findOne(id);
    }

    async getUser(id: string): Promise<any> {
        return await this.userRepository.findOne(id)
    }

}



