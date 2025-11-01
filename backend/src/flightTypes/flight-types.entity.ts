import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class FlightTypes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Ex: Fretado, Internacional, Nacional
}