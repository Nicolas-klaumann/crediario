import { Injectable } from '@nestjs/common';

@Injectable()
export class FinanceiroService {
  getMaiorValorEmAbertoMes(data): string {
    // ordena do mais antigo para o mais novo
    data.contratos.sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime(),
    );

    // inicializa prop para controle da logica
    let tempo = [];
    let saldo = 0.0;

    // iterar sobre os contratos e atualizar gradativamente o saldo
    data.contratos.map((contrato) => {
      // parse em cima da data para nomear a posição do array com o mes da movimentação
      const [anoContrato, mesContrato, diaContrato] = contrato.data.split('-');

      // controle de saldo
      saldo += contrato.valorfinanciado;

      this.atualizarSaldo(tempo, mesContrato, anoContrato, saldo);

      // verifica se o vencimento da primeira parcela é mais de 1 mes depois do inicio do contrato
      const mesesSemInteracao = this.diferencaEntreDatas(
        new Date(contrato.data),
        new Date(contrato.parcelas[0].datavencimento),
      );

      if (mesesSemInteracao >= 2) {
        this.adicionarMesesSemInteracao(tempo, contrato, mesesSemInteracao);
      }

      // calculo do pagamanento do contrato
      contrato.parcelas.map((parcela) => {
        // parse para nomer posicao do array
        const [anoVencimento, mesVencimento, diaVencimento] =
          parcela.datavencimento.split('-');

        // verifica se o pagamento está atrasado ou não foi feito
        if (!parcela.dataultimopagamento || this.isPagamentoAtrasado(parcela)) {
          this.atualizarSaldo(tempo, mesVencimento, anoVencimento, saldo);

          if (!parcela.dataultimopagamento) {
            return;
          }
        }

        // parse para nomer posicao do array
        const [anoParcela, mesParcela, diaParcela] =
          parcela.dataultimopagamento.split('-');

        // atualiza o saldo
        saldo -= parcela.totalpago;

        if (Math.abs(saldo) < 1e-10) {
          saldo = 0;
        }

        // se não existir uma movimentação nesse mes, cria uma, se existir, apenas atualiza o saldo
        if (!tempo[`${mesParcela}/${anoParcela}`]) {
          tempo[`${mesParcela}/${anoParcela}`] = {
            saldoDevedor: saldo,
          };
        } else {
          tempo[`${mesParcela}/${anoParcela}`].saldoDevedor = saldo;
        }

        return;
      });
    });

    return JSON.stringify(this.obterMaiorSaldo(tempo));
  }

  /**
   * Calcula a diferença de MESES entre as datas
   */
  diferencaEntreDatas(date1: Date, date2: Date): number {
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();

    return (year2 - year1) * 12 + (month2 - month1);
  }

  /**
   * Adiciona meses em uma data
   */
  adicionaMeses(date: Date, months: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  }

  /**
   * Verifica se o pagamento da parcela está atrasado
   */
  isPagamentoAtrasado(parcela): boolean {
    return (
      new Date(parcela.dataultimopagamento).getMonth() >
      new Date(parcela.datavencimento).getMonth()
    );
  }

  /**
   * Busca o maior saldo que ja esteve em aberto
   */
  obterMaiorSaldo(tempo): { mes: string; total_aberto: number } {
    let maximoSaldoValor = -Infinity;
    let maximoSaldoData = '';

    for (const mes in tempo) {
      if (tempo[mes].saldoDevedor > maximoSaldoValor) {
        maximoSaldoValor = tempo[mes].saldoDevedor;
        maximoSaldoData = mes;
      }
    }

    return { mes: maximoSaldoData, total_aberto: maximoSaldoValor };
  }

  /**
   * Cria a posição do mês ou atualiza o valor se ja existir
   */
  atualizarSaldo(tempo, mes, ano, saldo) {
    const chave = `${mes}/${ano}`;
    if (!tempo[chave]) {
      tempo[chave] = { saldoDevedor: saldo };
    } else {
      tempo[chave].saldoDevedor += saldo;
    }
  }

  /**
   * Verifica se o vencimento da primeira parcela é mais de 1 mes depois do inicio do contrato
   * É necessario colocar a divida nesse espaço de tempo
   */
  adicionarMesesSemInteracao(tempo, contrato, mesesSemInteracao) {
    for (let i = 1; i <= mesesSemInteracao - 1; i++) {
      const novaData = this.adicionaMeses(new Date(contrato.data), i);
      const [anoNovaData, mesNovaData] = novaData
        .toISOString()
        .split('T')[0]
        .split('-');

      this.atualizarSaldo(
        tempo,
        mesNovaData,
        anoNovaData,
        contrato.valorfinanciado,
      );
    }
  }
}
