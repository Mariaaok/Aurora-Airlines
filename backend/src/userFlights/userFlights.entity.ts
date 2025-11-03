import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity'; 
import { Flights } from '../flights/flights.entity';
import { Airports } from 'src/airports/airports.entity';


@Entity('user_flights') 
export class UserFlights {
  
  @PrimaryGeneratedColumn('uuid') 
  id: string;

  // --- Relação N:1 com Usuário ---
  // "Muitas reservas pertencem a UM usuário"

  @Column()
  userId: number; // Corresponde ao tipo 'id: number' da sua entidade User

  @ManyToOne(() => User, (user) => user.bookings) // 'bookings' foi o campo que adicionei à sua User.entity
  @JoinColumn({ name: 'userId' })
  user: User;

  // --- Relação N:1 com Voo ---
  // "Muitas reservas podem ser feitas para UM voo"

  @Column()
  flightId: number; // Corresponde ao tipo 'id: number' da sua entidade Flights

  @ManyToOne(() => Flights) // Você pode adicionar a relação inversa em Flights se quiser
  @JoinColumn({ name: 'flightId' })
  flight: Flights;

  // --- Dados Específicos da Reserva ---
  // Informações que só existem nesta reserva específica

  @Column({ nullable: true }) // O assento pode ser definido depois
  seatNumber: string; // Ex: "17C"

  @Column({
    enum: ['booked', 'checked-in', 'cancelled', 'completed'],
    default: 'booked'
  })
  status: 'booked' | 'checked-in' | 'cancelled' | 'completed';
  
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // Para saber quando a reserva foi feita
}