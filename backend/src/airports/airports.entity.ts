import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Airports {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column()
  city: string;
  @Column()
  country: string;
  @Column()
  state: string;
  @Column()
  IATA: string;
}