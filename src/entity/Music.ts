import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Music {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    album: string;

    @Column()
    track: string;

    @Column()
    artists: string;

    @Column({ name: 'original_name' })
    originalName: string;

    @Column()
    path: string;
}
