// import { Controller, Post, Body } from  '@nestjs/common';
// import { UserService } from  './user.service';

// import { Users } from '../../entities/users.model';
// import { User, GoogleUser } from '../../model';

// @Controller('user')
// export  class  UserController {
//     constructor(
//       private  userService:  UserService,
//       ) {}

//     @Post()
//     async registration(@Body() user: User){
//       return this.userService.registration(user);
//     }  

//     @Post('google')
//     async registrationGoogle(@Body() user: GoogleUser){
//       return this.userService.registrationGoogle(user);
//     }  

//     // @Post('login')
//     // async login(@Body() user: User){
//     //   return this.authService.validateUserByPassword(user);
//     // } 
// }
