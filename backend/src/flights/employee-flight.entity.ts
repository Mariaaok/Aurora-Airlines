import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Flights } from './flights.entity';
import { Employees } from '../employees/employees.entity'; // Assumindo o caminho e nome da Entidade Employees

@Entity()
export class EmployeeFlight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: number;

  @Column()
  flightId: number;

  @ManyToOne(() => Flights, flight => flight.staff, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flightId' })
  flight: Flights;

  @ManyToOne(() => Employees, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId' })
  employee: Employees;
}