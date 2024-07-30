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

    // iterar sobre os contratos e atualizar gradativamente o saldo
    data.contratos.map((contrato) => {
      // parse em cima da data para nomear a posição do array com o mes da movimentação
      const [anoContrato, mesContrato, diaContrato] = contrato.data.split('-');

      // cria ou atualiza o saldo do mes
      if (!tempo[`${mesContrato}/${anoContrato}`]) {
        tempo[`${mesContrato}/${anoContrato}`] = {
          saldoDevedor: contrato.valortotal - contrato.valorentrada,
        };
      } else {
        tempo[`${mesContrato}/${anoContrato}`].saldoDevedor +=
          contrato.valortotal - contrato.valorentrada;
      }

      // prop para controlar o valor financiado nas parcelas
      let valorFinanciado = contrato.valorfinanciado;

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
            tempo[`${mesVencimento}/${anoVencimento}`].saldoDevedor +=
              valorFinanciado;
          } else {
            tempo[`${mesVencimento}/${anoVencimento}`] = {
              saldoDevedor: valorFinanciado,
            };
          }

          if (!parcela.dataultimopagamento) {
            return;
          }
        }

        // parse para nomer posicao do array
        const [anoParcela, mesParcela, diaParcela] =
          parcela.dataultimopagamento.split('-');

        // atualiza valor financiado
        valorFinanciado -= parcela.totalpago;
        if (Math.abs(valorFinanciado) < 1e-10) {
          valorFinanciado = 0;
        }

        // se não existir uma movimentação nesse mes, cria uma, se existir, apenas atualiza o valor
        if (!tempo[`${mesParcela}/${anoParcela}`]) {
          tempo[`${mesParcela}/${anoParcela}`] = {
            saldoDevedor: valorFinanciado,
          };
        } else {
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
