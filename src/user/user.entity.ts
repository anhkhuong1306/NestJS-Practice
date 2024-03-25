import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, UpdateDateColumn, OneToMany } from "typeorm";
import { IsEmail } from "class-validator";
import * as argon2 from 'argon2';
import { DeviceSessionEntity } from "src/device/device.entity";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    @IsEmail()
    email: string;

    @Column({default: ''})
    bio: string;

    @Column({default: ''})
    image: string;

    @Column()
    password: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => DeviceSessionEntity, (deviceSession) => deviceSession.id)
    deviceSessions: DeviceSessionEntity[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await argon2.hash(this.password);
    }
}