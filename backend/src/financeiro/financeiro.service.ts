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

      // cria ou atualiza o saldo do mes
      if (!tempo[`${mesContrato}/${anoContrato}`]) {
        tempo[`${mesContrato}/${anoContrato}`] = {
          saldoDevedor: saldo,
        };
      } else {
        tempo[`${mesContrato}/${anoContrato}`].saldoDevedor += saldo;
      }

      // se a data de vencimento da primeira parcela for mais de 1 mes depois do inicio do contrato, é necessario colocar a divida nesse espaço de tempo
      const mesesSemInteracao = differenceInMonths(
        new Date(contrato.data),
        new Date(contrato.parcelas[0].datavencimento),
      );

      if (mesesSemInteracao >= 2) {
        for (let i = 1; i <= mesesSemInteracao - 1; i++) {
          const novaData = new Date(addMonths(new Date(contrato.data), i));

          const [anoNovaData, mesNovaData, diaNovaData] = novaData
            .toISOString()
            .split('T')[0]
            .split('-');
          if (tempo[`${mesNovaData}/${anoNovaData}`]) {
            tempo[`${mesNovaData}/${anoNovaData}`].saldoDevedor +=
              contrato.valorfinanciado;
          } else {
            tempo[`${mesNovaData}/${anoNovaData}`] = {
              saldoDevedor: contrato.valorfinanciado,
            };
          }
        }
      }

      // calculo do pagamanento do contrato
      contrato.parcelas.map((parcela) => {
        // parse para nomer posicao do array
        const [anoVencimento, mesVencimento, diaVencimento] =
          parcela.datavencimento.split('-');

        // se o pagamento for feito em outro mes ou não foi feito o pagamento
        // apenas guarda o valor financiado restante no mes de vencimento
        if (
          !parcela.dataultimopagamento ||
          new Date(parcela.dataultimopagamento).getMonth() >
            new Date(parcela.datavencimento).getMonth()
        ) {
          if (tempo[`${mesVencimento}/${anoVencimento}`]) {
            tempo[`${mesVencimento}/${anoVencimento}`].saldoDevedor += saldo;
          } else {
            tempo[`${mesVencimento}/${anoVencimento}`] = {
              saldoDevedor: saldo,
            };
          }

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

        // se não existir uma movimentação nesse mes, cria uma, se existir, apenas atualiza o valor
        if (!tempo[`${mesParcela}/${anoParcela}`]) {
          tempo[`${mesParcela}/${anoParcela}`] = {
            saldoDevedor: saldo,
          };
        } else {
          tempo[`${mesParcela}/${anoParcela}`].saldoDevedor = saldo;

          if (tempo[`${mesParcela}/${anoParcela}`].saldoDevedor < 1e-10) {
            tempo[`${mesParcela}/${anoParcela}`].saldoDevedor = 0;
          }
        }

        return;
      });
    });
    console.log(tempo);

    function differenceInMonths(date1, date2) {
      const year1 = date1.getFullYear();
      const month1 = date1.getMonth();
      const year2 = date2.getFullYear();
      const month2 = date2.getMonth();

      return (year2 - year1) * 12 + (month2 - month1);
    }

    function addMonths(date, months) {
      const d = new Date(date);
      d.setMonth(d.getMonth() + months);
      return d;
    }

    let maximoSaldoValor = -Infinity;
    let maximoSaldoData = '';

    for (const meses in tempo) {
      if (tempo[meses].saldoDevedor > maximoSaldoValor) {
        maximoSaldoValor = tempo[meses].saldoDevedor;
        maximoSaldoData = meses;
      }
    }

    return JSON.stringify({
      mes: maximoSaldoData,
      total_aberto: maximoSaldoValor,
    });
  }
}
