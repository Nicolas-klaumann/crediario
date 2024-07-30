import { Injectable } from '@nestjs/common';

@Injectable()
export class FinanceiroService {
  getMaiorValorEmAbertoMes(data): string {
    // ordena do mais antigo para o mais novo
    data.contratos.sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime(),
    );

    let tempo = [];
    let valorFinanciado = 0;

    // iterar sobre os contratos e atualizar gradativamente o saldo
    data.contratos.map((contrato) => {
      // parse em cima da data para nomear o array com o mes da movimentação
      const [anoContrato, mesContrato, diaContrato] = contrato.data.split('-');

      // se não existir uma movimentação nesse mes, cria uma, se existir, apenas atualiza o valor
      if (!tempo[`${mesContrato}/${anoContrato}`]) {
        tempo[`${mesContrato}/${anoContrato}`] = {
          saldoDevedor: contrato.valortotal - contrato.valorentrada,
        };
      } else {
        tempo[`${mesContrato}/${anoContrato}`].saldoDevedor +=
          contrato.valortotal - contrato.valorentrada;
      }

      valorFinanciado = contrato.valorfinanciado;

      // calculo do pagamanento do contrato
      contrato.parcelas.map((parcela) => {
        // busca a data que foi pago a parcela
        if (!parcela.dataultimopagamento) {
          return;
        }

        const [anoParcela, mesParcela, diaParcela] =
          parcela.dataultimopagamento.split('-');

        // se não existir uma movimentação nesse mes, cria uma, se existir, apenas atualiza o valor
        if (!tempo[`${mesParcela}/${anoParcela}`]) {
          valorFinanciado -= parcela.totalpago;
          if (Math.abs(valorFinanciado) < 1e-10) {
            valorFinanciado = 0;
          }

          tempo[`${mesParcela}/${anoParcela}`] = {
            saldoDevedor: valorFinanciado,
          };
        } else {
          valorFinanciado -= parcela.totalpago;
          if (Math.abs(valorFinanciado) < 1e-10) {
            valorFinanciado = 0;
          }

          tempo[`${mesParcela}/${anoParcela}`].saldoDevedor -=
            parcela.totalpago;

          if (tempo[`${mesParcela}/${anoParcela}`].saldoDevedor < 1e-10) {
            tempo[`${mesParcela}/${anoParcela}`].saldoDevedor = 0;
          }
        }

        return;
      });
    });
    console.log(tempo);

    return JSON.stringify(data);
  }
}
