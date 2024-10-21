import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserContact {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.contacts)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'contact_id' })
    contact: User;
}