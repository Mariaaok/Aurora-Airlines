import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AircraftTypes } from '../aircraftTypes/aircraft-types.entity'; // Importa o tipo de aeronave

@Entity()
export class Aircrafts {
  // O ID é fornecido pelo administrador (ex: A001, B002), não auto-gerado
  @PrimaryColumn()
  id: string;

  // Chave Estrangeira e Relação com AircraftTypes
  @Column()
  aircraftTypeId: number;

  @ManyToOne(() => AircraftTypes)
  @JoinColumn({ name: 'aircraftTypeId' })
  aircraftType: AircraftTypes;
}