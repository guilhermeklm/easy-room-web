<template>
  <h2>Reservar Sala</h2>

  <PVDialog
    v-model:visible="visible"
    :showHeader="false"
    class="responsive-dialog"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <div class="dialog-content">
      <p class="dialog-message">
        <i class="pi pi-check"> Reserva criada com sucesso! </i>
      </p>
      <PVButton
        icon="pi pi-times"
        class="p-button-rounded p-button-text close-button"
        @click="visible = false"
      />
    </div>
  </PVDialog>

  <div class="form-container">
    <div class="overlay" v-if="loading">
      <VueSpinner size="50" color="black" />
    </div>

    <div class="form-group">
      <label for="title">Título</label>
      <input id="title" v-model="title" type="text" />
    </div>

    <div class="form-group">
      <label for="room">Sala</label>
      <select id="room" v-model="roomId">
        <option disabled value="">Selecione uma sala</option>
        <option v-for="room in roomOptions" :key="room._roomId" :value="room._roomId">
          {{ room._name }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="start">Data e hora Início</label>
      <VueDatePicker
        id="start"
        v-model="startDateTime"
        :format="format"
        :min-date="todayDate"
        :timezone="timezone"
      />
    </div>

    <div class="form-group">
      <label for="end">Data e hora Fim</label>
      <VueDatePicker
        id="end"
        v-model="endDateTime"
        :format="format"
        :min-date="minDateAux"
        :timezone="timezone"
      />
    </div>

    <div class="form-group">
      <label for="description">Descrição</label>
      <input id="description" v-model="description" type="text" maxlength="300" />
    </div>

    <PVButton @click="submit"> Reservar </PVButton>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker'
import moment from 'moment'
import axiosInstance from '@/services/http'
import { useAuthStore } from '@/stores/auth'
import { VueSpinner } from 'vue3-spinners'
import PVDialog from 'primevue/dialog'
import PVButton from 'primevue/button'

const currentDateTime = moment().format('MM-DD-yyyy, HH:mm')

export default {
  components: {
    VueDatePicker,
    VueSpinner,
    PVDialog,
    PVButton
  },
  data() {
    return {
      visible: false,
      title: null,
      roomId: null,
      roomOptions: [],
      todayDate: currentDateTime,
      startDateTime: currentDateTime,
      endDateTime: currentDateTime,
      minDateAux: currentDateTime,
      timezone: 'America/Sao_Paulo',
      format: 'dd/MM/yyyy HH:mm',
      errorMessage: null,
      loading: true
    }
  },
  async created() {
    try {
      const authStore = useAuthStore()
      const token = authStore.getToken().value

      const response = await axiosInstance.get('/v1/rooms', {
        headers: {
          Authorization: token
        }
      })

      if (response.data) {
        this.roomOptions = response.data.data
      }
    } catch (error) {
      this.errorMessage =
        'Erro ao carregar as opções de salas. Por favor, tente novamente mais tarde.'
      console.error(error)
    } finally {
      this.loading = false
    }
  },
  watch: {
    startDateTime(newInitialDate, oldInitialDate) {
      if (newInitialDate == null) {
        this.startDateTime = currentDateTime
        this.endDateTime = currentDateTime
      }

      const newValue = moment(newInitialDate).format('MM-DD-yyyy, HH:mm')
      const oldInitialDateFormatted = moment(oldInitialDate).format('MM-DD-yyyy, HH:mm')

      if (newValue > oldInitialDateFormatted) {
        this.endDateTime = newValue
      }
      this.minDateAux = newValue
    }
  },
  methods: {
    showDialog() {
      this.loading = false
      this.visible = true

      setTimeout(() => {
        this.visible = false
      }, 5000)
    },
    async submit() {
      this.errorMessage = null
      this.loading = true

      if (
        !this.title ||
        !this.roomId ||
        !this.startDateTime ||
        !this.endDateTime ||
        !this.description
      ) {
        this.errorMessage = 'Todos os campos são obrigatórios.'
        return
      }

      const authStore = useAuthStore()
      const token = authStore.getToken().value
      const startDateTimeFormatted = moment(this.startDateTime).format('MM-DD-yyyy, HH:mm')
      const endDateTimeFormatted = moment(this.endDateTime).format('MM-DD-yyyy, HH:mm')

      const body = {
        title: this.title,
        roomId: this.roomId,
        startDateTime: startDateTimeFormatted,
        endDateTime: endDateTimeFormatted,
        description: this.description
      }

      try {
        await axiosInstance.post('/v1/reservations', body, {
          headers: {
            Authorization: token
          }
        })

        this.showDialog()
      } catch (error) {
        const response = error.response
        this.loading = false
        this.errorMessage = response.data.message
      }
    }
  }
}
</script>

<style scoped>
.form-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  position: relative;
}

.form-group {
  display: flex;
  flex-direction: column;
  flex-basis: calc(50% - 16px);
}

.overlay {
  position: absolute; /* Faz a sobreposição ocupar toda a tela */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Garante que a sobreposição fique acima de outros elementos */
}

button {
  align-self: auto;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  margin-top: 16px;
}

.responsive-dialog {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.dialog-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 1rem;
}

.dialog-message {
  font-size: calc(1rem + 0.5vw);
}
</style>
