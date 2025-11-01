import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AircraftTypes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column({ type: 'int' })
  seats: number;

  @Column()
  description: string;

  @Column({ type: 'text' }) // Usa tipo 'text' para armazenar o JSON do layout
  layoutData: string;
}