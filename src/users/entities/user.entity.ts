import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { UserContact } from "./user-contact.entity";
import { UserBlocked } from "./user-blocked.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: "user" })
    role: string;
    
    @Column()
    avatar: string;
        
    @OneToMany(() => UserContact, userContact => userContact.user)
    contacts: UserContact[];
    
    @OneToMany(() => UserBlocked, userBlocked => userBlocked.user)
    blocked: UserBlocked[];

    @Column({ default: true })
    tips: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
