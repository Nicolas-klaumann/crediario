import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceiroController } from './financeiro.controller';
import { FinanceiroService } from './financeiro.service';

@Module({
  imports: [],
  controllers: [FinanceiroController],
  providers: [FinanceiroService],
})
export class FinanceiroModule {}
