import { Controller, Post, Body, UseGuards, Get, Req, Res, Param, Put, UploadedFile, UseInterceptors, UploadedFiles  } from  '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';

import { AuthService } from  './auth.service';
import { User, SocialUser } from '../../model';
import { MulterOptions } from '../multer-config';
import { ObjectID } from 'typeorm';

@Controller('auth')
export  class  AuthController {
    constructor(private  authService:  AuthService) {}

    
    @Post('login')
    async login(@Body() user: User){
      return this.authService.login(user);
    }

    @Post('reg')
    async registration(@Body() user: User){
      return this.authService.registration(user);
    }  

    @Post('social')
    async registrationSocial(@Body() user: SocialUser){
      return await this.authService.registrationSocial(user); 
    }  

    @UseGuards(AuthGuard('jwt'))
    @Get('user')
    async getUser(@Req() req) {
      return await this.authService.getUser(req.user.id);
    }

    // @UseGuards(AuthGuard('jwt'))
    // @Put(':id')
    // async changeUser(@Param('id') id: ObjectID, @Body() user: SocialUser) {
    //   console.log('test');
    //   return await this.authService.changeUser(id, user);
    // }

    @UseGuards(AuthGuard('jwt'))
    @Post('uploadPhoto')
    @UseInterceptors(AnyFilesInterceptor(MulterOptions))
    async uploadFile(@UploadedFiles() files, @Req() req) {
      console.log(files);
      return await this.authService.changeUserImage(req.user.id, files[0].filename )
    
    }
    
}
