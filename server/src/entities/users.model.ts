import { Entity, Column, ObjectIdColumn, } from 'typeorm';


@Entity()
export class Users {
    @ObjectIdColumn()
    id: number;

    @Column()
    login: string;

    @Column()
    password: string;
    
    @Column()
    email: string;

    @Column()
    imageUrl: string;
}