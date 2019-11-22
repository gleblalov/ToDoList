import { Entity, Column, ObjectIdColumn, } from 'typeorm';

@Entity()
export class Tasks {
    @ObjectIdColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    userID: string;

    @Column()
    isDone: boolean;

    @Column()
    describe: string;

    @Column()
    position: Object;
}