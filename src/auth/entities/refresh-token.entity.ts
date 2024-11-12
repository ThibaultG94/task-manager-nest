import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    token: string;

    @Column({ type: 'uuid' })
    userId: string;

    @ManyToOne(() => User, user => user.refreshTokens, {
        onDelete: 'CASCADE'
    })
    user: User;

    @Column({ type: 'datetime' })
    expiresAt: Date;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;
}