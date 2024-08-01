<template>
  <div v-if="orderContratos(jsonData)" class="table-container">
    <table>
      <thead>
        <tr>
          <th>Código do contrato</th>
          <th>Data</th>
          <th>Valor Entrada</th>
          <th>Valor Financiado</th>
          <th>Valor Total</th>
          <th>Qtd. Parcelas</th>
          <th>Valor Pago</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contrato in jsonData.contratos" :key="contrato.contrato">
          <td>{{ contrato.contrato }}</td>
          <td>{{ formatDate(contrato.data) }}</td>
          <td>{{ formatValue(contrato.valorentrada) }}</td>
          <td>{{ formatValue(contrato.valorfinanciado) }}</td>
          <td>{{ formatValue(contrato.valortotal) }}</td>
          <td>{{ contrato.parcelas.length }}x</td>
          <td>{{ valorPago(contrato.parcelas) }}</td>
          <td>
            <button class="btn" type="button" @click="openModal(contrato)">Ver Parcelas</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <div class="header-container">
          <h4 style="margin: 0px;">PARCELAR DO CONTRATO: <b>{{ selectedContrato.contrato }}</b></h4>
          <span class="close" @click="closeModal">&times;</span>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Data de Vencimento</th>
                <th>Valor da Parcela</th>
                <th>Valor Pago</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="parcela in selectedContrato.parcelas" :key="parcela.datavencimento">
                <td>{{ formatDate(parcela.datavencimento) }}</td>
                <td>{{ formatValue(parcela.valorvencimento) }}</td>
                <td>{{ formatValue(parcela.totalpago) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListContratos',
  props: {
    jsonData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showModal: false,
      selectedContrato: null
    };
  },
  methods: {
    openModal(contrato) {
      this.selectedContrato = contrato;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedContrato = null;
    },
    formatValue(value) {
      return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    },
    formatDate(date) {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    },
    valorPago(parcelas) {
      const valorPago = parcelas.reduce((total, parcela) => {
        return total + (parcela.totalpago || 0);
      }, 0);
      return this.formatValue(valorPago)
    },
    orderContratos(data) {
      return data.contratos.sort(
        (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime(),
      );
    }
  }
};
</script>

<style scoped>
.table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-top: 0px;
  margin-top: 0px;
}

table {
  width: 95%;
  border-collapse: collapse;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #02E09F;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 5% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  border-radius: 10px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

.close {
  color: #aaa;
  font-size: 40px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.btn {
  background-color: #02E09F;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  border-radius: 4px;
  padding: 8px 16px;
  color: white;
  border: none;
  cursor: pointer;
}

.btn:hover {
  background-color: #029e80;
}

.header-container {
  display: flex;
  justify-content: space-between; /* Espaça os itens, colocando o h4 à esquerda e o span à direita */
  align-items: center; /* Centraliza verticalmente os itens */
  width: 100%; /* Ajuste conforme necessário */
  padding: 10px; /* Ajuste conforme necessário */
}
</style>
