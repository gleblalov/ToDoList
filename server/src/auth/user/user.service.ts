// import { Injectable } from '@nestjs/common';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm'
// import { Users } from '../../entities/users.model';
// import { User, GoogleUser } from '../../model';
// import * as crypto from 'crypto';



// @Injectable()
// export class UserService {

//     constructor(
//         @InjectRepository(Users) private userRepository: Repository<Users>,
        
//     ) { }

//     async registration(user: User): Promise<User>{
//         user.password = crypto.createHmac('sha256', user.password).digest('hex');
//         return await this.userRepository.save(user)
//     } 

//     async registrationGoogle(user: GoogleUser): Promise<any>{
//         this.findByEmail(user.email).then(findUser => {
//             if(!findUser){
//                 return this.userRepository.save(user)
//             }
//         })
        
//     } 

//     async findByLogin(login: string): Promise<User> {
//         return await this.userRepository.findOne({
//             where: {
//                 login: login,
//             }
//         });
//     }

//     async findByEmail(email: string): Promise<User> {
//         return await this.userRepository.findOne({
//             where: {
//                 email: email,
//             }
//         });
//     }

//     async findById(id: string): Promise<User> {
//         return await this.userRepository.findOne(id);
//     }

    
// }








//   // async findByEmail(email: string): Promise<User> {
//     //     return await this.userRepository.findOne({
//     //         where: {
//     //             email: email,
//     //         }
//     //     });
//     // }

//     // async findById(id: number): Promise<User> {
//     //     return await this.userRepository.findOne({
//     //         where: {
//     //             id: id,
//     //         }
//     //     });
//     // }