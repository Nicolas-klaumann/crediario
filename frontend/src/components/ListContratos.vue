<template>
  <div v-if="jsonData">
    <table>
      <thead>
        <tr>
          <th>Codigo do contrato</th>
          <th>Data</th>
          <th>Valor Financiado</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contrato in jsonData.contratos" :key="contrato.contrato">
          <td>{{ contrato.contrato }}</td>
          <td>{{ contrato.data }}</td>
          <td>{{ contrato.valorfinanciado }}</td>
          <td>
            <button @click="openModal(contrato)">Ver Parcelas</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>Parcelas do Contrato {{ selectedContrato.id }}</h2>
        <ul>
          <li v-for="parcela in selectedContrato.parcelas" :key="parcela.datavencimento">
            <strong>Data de Vencimento:</strong> {{ parcela.datavencimento }}<br>
            <strong>Valor da Parcela:</strong> {{ parcela.valorvencimento }}<br>
          </li>
        </ul>
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
    }
  }
};
</script>

<style scoped>
table {
  width: 90%;
  border-collapse: collapse;
  border-radius: 2px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #02E09F;
}

.modal {
  display: block; /* Show the modal */
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
