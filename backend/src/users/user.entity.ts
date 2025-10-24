import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column()
  address: string;
  @Column()
  phoneNumber: string;
  @Column()
  email: string;
  @Column()
  workplace: string;
  @Column()
  workplaceAddress: string;
  @Column()
  birthday: string;
  @Column()
  CPF: string;
  @Column()
  RG: string;
  @Column()
  RGIssueDate: string;
  @Column()
  IssuingBodyofRG: string;
  @Column()
  password: string;
  @Column({ default: true })
  @Column({ default: 'user' }) 
  role: 'admin' | 'user';
  isActive: boolean;
}
