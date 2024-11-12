import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { UserContact } from "./user-contact.entity";
import { UserBlocked } from "./user-blocked.entity";
import { RefreshToken } from '../../auth/entities/refresh-token.entity';
@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: "user" })
    role: string;
    
    @Column({ nullable: true })
    avatar: string;
        
    @OneToMany(() => UserContact, userContact => userContact.user)
    contacts: UserContact[];
    
    @OneToMany(() => UserBlocked, userBlocked => userBlocked.user)
    blocked: UserBlocked[];

    @Column({ default: true })
    tips: boolean;

    @OneToMany(() => RefreshToken, refreshToken => refreshToken.user, {
        lazy: true // Utiliser le chargement paresseux
      })
    refreshTokens: Promise<RefreshToken[]>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
