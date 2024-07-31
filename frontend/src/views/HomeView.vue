<template>
  <div class="background-green d-flex justify-content-center align-items-center vh-100">
    <div class="card text-center card-dynamic">
      <div class="card-header">
        DETALHAMENTO DE FINANÇAS
      </div>
      <div class="card-body">
        <div class="input-group mb-3">
          <input type="file" class="form-control" id="inputGroupFile01" @change="handleFileUpload">
        </div>
        <div style="text-align: left;">
          <button class="btn btn-spacing" type="button" @click="detalharContratos">Listar Contratos</button>
          <button class="btn btn-spacing" type="button" @click="calcularEndividamento">Calcular Endividamento</button>
        </div>
      </div>
      <div class="card-content">
        <ListContratos v-if="mostrarContratos" :jsonData="jsonData"/>
      </div>
    </div>
  </div>
</template>

<script>
import ListContratos from './../components/ListContratos.vue';

export default {
  name: 'HomeView',
  components: {
    ListContratos,
  },
  data() {
    return {
      jsonData: null,
      mostrarContratos: false
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          this.jsonData = JSON.parse(e.target.result);
        } catch (error) {
          console.error("Erro ao carregar o arquivo JSON", error);
        }
      };
      if (file) {
        reader.readAsText(file);
      }
    },
    detalharContratos() {
      if (this.jsonData) {
        this.mostrarContratos = true;
        console.log("Detalhando contratos e parcelas", this.jsonData);
      } else {
        alert("Por favor, carregue um arquivo JSON primeiro.");
      }
    },
    calcularEndividamento() {
      if (this.jsonData) {
        // Implemente a lógica para calcular o endividamento
        console.log("Calculando endividamento", this.jsonData);
      } else {
        alert("Por favor, carregue um arquivo JSON primeiro.");
      }
    }
  }
};
</script>

<style scoped>
.card-dynamic {
  width: 85%;
  max-height: 90%; /* Altura máxima do card */
  overflow-y: auto; /* Permite rolagem vertical */
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 25px;
}

.card-header {
  background-color: #02E09F;
}

.card-body, .card-content {
  padding: 10px;
}

.btn {
  background-color: #02E09F;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

.btn-spacing {
  margin-right: 5px; /* Espaço de 5px entre os botões */
}

/* Remove a margem do botão direito para o último botão */
.btn-spacing:last-child {
  margin-right: 0;
}

.background-green {
  background-color: #006151; /* Verde personalizado */
}

.vh-100 {
  height: 100vh; /* Altura total da viewport */
}
</style>
