import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Employees {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column()
  phoneNumber: string;
  @Column()
  email: string;
  @Column()
  birthday: string;
  @Column()
  category: string;
}