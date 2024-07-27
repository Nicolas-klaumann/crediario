import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinanceiroModule } from './financeiro/financeiro.module';

@Module({
  imports: [FinanceiroModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
