import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.refreshTokens)
    @JoinColumn({ name: 'uid' })
    user: User;

    @Column({ name: 'jwt_id' })
    jwtId: string;

    @Column({ default: false })
    used: boolean;

    @Column({ default: false })
    invalidated: boolean;

    @Column({ name: 'expiry_date' })
    expiryDate: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
