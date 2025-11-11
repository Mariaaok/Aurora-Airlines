import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Flights } from '../flights/flights.entity';

@Entity('purchases')
export class Purchases {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  departureFlightId: number;

  @ManyToOne(() => Flights)
  @JoinColumn({ name: 'departureFlightId' })
  departureFlight: Flights;

  @Column({ type: 'text' })
  departureSeats: string;

  @Column({ nullable: true })
  returnFlightId: number;

  @ManyToOne(() => Flights, { nullable: true })
  @JoinColumn({ name: 'returnFlightId' })
  returnFlight: Flights;

  @Column({ type: 'text', nullable: true })
  returnSeats: string;

  @Column({ type: 'text' })
  passengers: string;

  @Column({
    enum: ['credit_card', 'bank_slip'],
  })
  paymentMethod: 'credit_card' | 'bank_slip';

  @Column({ type: 'text', nullable: true })
  paymentDetails: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  })
  status: 'pending' | 'confirmed' | 'cancelled';

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
