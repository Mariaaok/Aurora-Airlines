import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFlights } from './userFlights.entity';
import { UserFlightsService } from './userFlights.service';
import { UserFlightsController } from './userFlights.controller';
import { AuthModule } from 'src/auth/auth.module'; // Importante para o Guard

@Module({
  imports: [
    // 1. Importa o TypeOrm para esta entidade específica (UserFlights)
    // Isso permite que o UserFlightsService use @InjectRepository(UserFlights).
    TypeOrmModule.forFeature([UserFlights]),
    
    // 2. Importa o AuthModule
    // O seu UserFlightsController usa o 'SessionAuthGuard'.
    // Importar o AuthModule garante que o guardião e todas as
    // dependências de sessão/passport estejam disponíveis para este módulo.
    AuthModule, 
  ],
  // 3. Registra o controller que você criou
  controllers: [UserFlightsController],
  
  // 4. Registra o service que você criou
  providers: [UserFlightsService],
})
export class UserFlightsModule {}