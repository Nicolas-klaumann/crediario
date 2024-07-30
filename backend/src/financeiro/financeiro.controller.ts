import { Controller, Post, Get, Body } from '@nestjs/common';
import { FinanceiroService } from './financeiro.service';

@Controller()
export class FinanceiroController {
  constructor(private readonly financeiroService: FinanceiroService) {}

  // busca o mes com o maior valor em aberto
  @Post('/financeiro')
  getMaiorValorEmAbertoMes(@Body() data): string {
    return this.financeiroService.getMaiorValorEmAbertoMes(data);
  }
}
