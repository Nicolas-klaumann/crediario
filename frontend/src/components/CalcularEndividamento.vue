<template>
  <div>
    <h1>SALDO EM ABERTO: {{ data }}</h1>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CalcularEndividamento',
  props: {
    jsonData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      contratos: this.jsonData, // Contratos inseridos
      data: null, // Armazena os dados retornados pela requisição
      error: null // Armazena qualquer erro que ocorra
    };
  },
  methods: {
    async fetchData() {
      try {
        const contratos = this.contratos
        const response = await axios.post('http://localhost:3000/financeiro/valor-em-aberto', contratos, {
            headers: {
              'Content-Type': 'application/json'
            }
        });

        this.data = this.formatValue(response.data);
      } catch (error) {
        this.error = error;
        console.error('Erro ao buscar dados:', error);
      }
    },
    formatValue(value) {
      return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    }
  },
  mounted() {
    this.fetchData(); // Chama a função de requisição quando o componente é montado
  }
}
</script>

<style scoped>
</style>
