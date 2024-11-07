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
      <InputText id="title" v-model="title" />
    </div>

    <div class="form-group">
      <label for="room">Sala</label>
      <PVSelect
        v-model="roomSelected"
        :options="roomOptions"
        optionLabel="_name"
        placeholder="Selecione a sala"
        class="w-full md:w-56"
      />
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

    <div class="form-group full-width">
      <label for="description">Descrição</label>
      <PVTextarea v-model="description" rows="5" cols="30" />
    </div>

    <div class="form-group">
      <PVButton label="Ativar/Desativar Recorrência" @click="toggleRecurrence" />
    </div>

    <div v-if="isRecurring" class="recurrence-config">
      <div class="form-group">
        <label for="recurrenceEndDate">Data de Término da Recorrência</label>
        <VueDatePicker
          id="recurrenceEndDate"
          v-model="recurrenceConfiguration.endDate"
          :format="format"
          :min-date="todayDate"
          :timezone="timezone"
        />
      </div>

      <div class="form-group">
        <label>Dias da Semana</label>
        <div class="weekdays-selector">
          <label v-for="(day, index) in weekdays" :key="index">
            <input
              type="checkbox"
              :value="day.value"
              v-model="recurrenceConfiguration.selectedWeekdays"
            />
            {{ day.label }}
          </label>
        </div>
      </div>
    </div>

    <PVButton @click="submit">Reservar</PVButton>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>

  <div class="is-light-mode calendar-wrapper">
    <Qalendar :events="events" :config="config" :is-loading="loading" />
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
import InputText from 'primevue/inputtext'
import PVTextarea from 'primevue/textarea'
import PVSelect from 'primevue/select'
import { Qalendar } from 'qalendar'

const currentDateTime = moment().format('MM-DD-yyyy, HH:mm')

export default {
  components: {
    VueDatePicker,
    VueSpinner,
    PVDialog,
    PVButton,
    InputText,
    PVTextarea,
    PVSelect,
    Qalendar
  },
  data() {
    return {
      visible: false,
      title: null,
      roomSelected: null,
      roomOptions: [],
      todayDate: currentDateTime,
      startDateTime: currentDateTime,
      endDateTime: currentDateTime,
      minDateAux: currentDateTime,
      timezone: 'America/Sao_Paulo',
      format: 'dd/MM/yyyy HH:mm',
      errorMessage: null,
      loading: true,
      reservations: [],
      events: [],
      isRecurring: false,
      recurrenceConfiguration: {
        endDate: null,
        selectedWeekdays: []
      },
      weekdays: [
        { label: 'Domingo', value: 0 },
        { label: 'Segunda', value: 1 },
        { label: 'Terça', value: 2 },
        { label: 'Quarta', value: 3 },
        { label: 'Quinta', value: 4 },
        { label: 'Sexta', value: 5 },
        { label: 'Sábado', value: 6 }
      ],
      config: {
        disableModes: ['day', 'week'],
        defaultMode: 'month',
        showCurrentTime: true,
        locale: 'pt-BR'
      }
    }
  },
  async created() {
    await this.loadReservations()

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
    toggleRecurrence() {
      this.isRecurring = !this.isRecurring
      if (!this.isRecurring) {
        this.recurrenceConfiguration.endDate = null
        this.recurrenceConfiguration.selectedWeekdays = []
      }
    },
    async loadReservations() {
      try {
        const authStore = useAuthStore()
        const token = authStore.getToken().value

        const response = await axiosInstance.get('/v1/reservations', {
          headers: {
            Authorization: token
          }
        })

        if (response.data) {
          let events = []
          for (const reservation of response.data) {
            events.push({
              id: reservation.id,
              title: reservation.title,
              description: reservation.description,
              location: reservation.roomName + ' - ' + reservation.locationAddress,
              color: 'blue',
              isEditable: false,
              time: {
                start: reservation.startDateTime,
                end: reservation.endDateTime
              }
            })
          }
          this.events = events
        }
      } catch (error) {
        this.errorMessage =
          'Erro ao carregar as opções de salas. Por favor, tente novamente mais tarde.'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
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
        !this.roomSelected ||
        !this.startDateTime ||
        !this.endDateTime ||
        !this.description
      ) {
        this.errorMessage = 'Todos os campos são obrigatórios.'
        this.loading = false
        return
      }

      if (this.isRecurring) {
        if (!this.recurrenceConfiguration.endDate) {
          this.errorMessage = 'Data final da recorrencia é obrigatoria'
          this.loading = false
          return
        }
      }

      const authStore = useAuthStore()
      const token = authStore.getToken().value
      const startDateTimeFormatted = moment(this.startDateTime).format('MM-DD-yyyy, HH:mm')
      const endDateTimeFormatted = moment(this.endDateTime).format('MM-DD-yyyy, HH:mm')

      const body = {
        title: this.title,
        roomId: this.roomSelected._roomId,
        startDateTime: startDateTimeFormatted,
        endDateTime: endDateTimeFormatted,
        description: this.description,
        isRecurring: this.isRecurring,
        recurrence: { ...this.recurrenceConfiguration }
      }

      try {
        await axiosInstance.post('/v1/reservations', body, {
          headers: {
            Authorization: token
          }
        })

        this.showDialog()
        await this.loadReservations()
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
  flex: 1 1 45%; /* Ajusta para que ocupe 45% da largura disponível */
  min-width: 300px; /* Largura mínima para cada grupo de formulário */
}

.full-width {
  flex: 1 1 100%; /* Para o campo de descrição, ocupa 100% da largura */
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
  font-size: calc(1r20 + 0.5vw);
}

.calendar-wrapper {
  padding: 20px 10px;
  max-width: 100%;
  height: 70vh;
  overflow: auto;
}

.recurrence-config {
  margin-top: 16px;
}

.weekdays-selector {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.weekdays-selector label {
  display: flex;
  align-items: center;
}

.weekdays-selector input {
  margin-right: 4px;
}
</style>
