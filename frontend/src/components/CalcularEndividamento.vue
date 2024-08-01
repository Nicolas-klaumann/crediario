<template>
  <div>
    <h1>Saldo em aberto: {{ data }}</h1>
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
      contratos: this.jsonData,
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
          }); // Substitua com a URL da sua API

        console.log(response);
        this.data = response.data; // Armazena os dados retornados na propriedade `data`
      } catch (error) {
        this.error = error; // Armazena o erro, se ocorrer
        console.error('Erro ao buscar dados:', error);
      }
    }
  },
  mounted() {
    this.fetchData(); // Chama a função de requisição quando o componente é montado
  }
}
</script>

<style scoped>
/* Estilos podem ser adicionados aqui */
</style>
