import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserBlocked {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.blocked)
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: "blocked_user_id" })
    blockedUser: User;
}