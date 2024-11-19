<template>
  <PVDialog
    @show="handleDialogShow"
    @hide="handleDialogHide"
    v-model:visible="visible"
    modal
    :header="headerDialog"
  >
    <div class="form-container">
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
        <DatePicker
          id="startDateTime"
          v-model="startDateTime"
          :minDate="todayDate"
          dateFormat="dd/mm/yy"
          showTime
          hourFormat="24"
          showIcon="true"
          fluid
        />
      </div>

      <div class="form-group">
        <label for="end">Data e hora Fim</label>
        <DatePicker
          id="endDateTime"
          v-model="endDateTime"
          :minDate="minDateAux"
          dateFormat="dd/mm/yy"
          showTime
          hourFormat="24"
          showIcon="true"
        />
      </div>

      <div class="form-group">
        <label for="description">Descrição</label>
        <PVTextarea :disabled="loading" v-model="description" rows="5" cols="30" />
      </div>

      <div class="form-group">
        <PVButton label="Ativar/Desativar Recorrência" @click="toggleRecurrence" />
      </div>

      <div v-if="isRecurring" class="recurrence-config">
        <div class="form-group">
          <label for="recurrenceEndDate">Data de Término da Recorrência</label>
          <DatePicker
            id="recurrenceEndDate"
            v-model="recurrenceConfiguration.endDate"
            :minDate="todayDate"
            dateFormat="dd/mm/yy"
            showIcon="true"
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

      <div v-if="isReserveEdition">
        <PVButton class="pv-button-reservar" @click="submit">Salvar</PVButton>
      </div>
      <div v-else>
        <PVButton class="pv-button-reservar" @click="submit">Reservar</PVButton>
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </PVDialog>
</template>

<script>
import PVDialog from 'primevue/dialog'
import PVButton from 'primevue/button'
import InputText from 'primevue/inputtext'
import PVTextarea from 'primevue/textarea'
import PVSelect from 'primevue/select'
import moment from 'moment'
import axiosInstance from '@/services/http'
import { useAuthStore } from '@/stores/auth'
import DatePicker from 'primevue/datepicker'

const currentDateTime = moment().toDate()

export default {
  name: 'ReservationForm',
  components: {
    PVDialog,
    PVButton,
    InputText,
    PVTextarea,
    PVSelect,
    DatePicker
  },
  props: {
    reservation: Object,
    isEdit: Boolean
  },
  data() {
    return {
      loading: false,
      visible: false,
      isReserveEdition: this.isEdit,
      title: this.reservation?.title || '',
      description: this.reservation?.description || '',
      roomSelected: this.reservation?.roomSelected || null,
      startDateTime: this.reservation?.time?.start || currentDateTime,
      endDateTime: this.reservation?.time?.end || currentDateTime,
      roomOptions: [],
      todayDate: currentDateTime,
      minDateAux: currentDateTime,
      timezone: 'America/Sao_Paulo',
      errorMessage: null,
      isRecurring: false,
      recurrenceConfiguration: {
        endDate: this.addOneMonth(currentDateTime),
        selectedWeekdays: []
      },
      headerDialog: null,
      weekdays: [
        { label: 'Domingo', value: 0 },
        { label: 'Segunda', value: 1 },
        { label: 'Terça', value: 2 },
        { label: 'Quarta', value: 3 },
        { label: 'Quinta', value: 4 },
        { label: 'Sexta', value: 5 },
        { label: 'Sábado', value: 6 }
      ]
    }
  },
  async created() {
    await this.loadRooms()
  },
  watch: {
    reservation: {
      immediate: true,
      handler(newReservation) {
        if (newReservation) {
          this.title = newReservation.title || ''
          this.description = newReservation.description || ''
          this.roomSelected = newReservation.room || null
          this.startDateTime = newReservation.time?.start || currentDateTime
          this.endDateTime = newReservation.time?.end || currentDateTime
          this.isRecurring = newReservation.isRecurring || false
          this.recurrenceConfiguration = {
            endDate: newReservation.recurrence?.endDate || null,
            selectedWeekdays: newReservation.recurrence?.selectedWeekdays || []
          }
          this.headerDialog = 'Edição da reserva'
          this.isReserveEdition = true
        } else {
          this.resetForm()
        }
      }
    },
    startDateTime(newInitialDate, oldInitialDate) {
      if (newInitialDate == null) {
        this.startDateTime = currentDateTime
        this.endDateTime = currentDateTime

        if (this.isRecurring) {
          this.recurrenceConfiguration.endDate = this.addOneMonth(currentDateTime)
        }
      }

      const newValue = moment(newInitialDate).toDate()
      const oldInitialDateFormatted = moment(oldInitialDate).toDate()

      if (newValue > oldInitialDateFormatted) {
        this.endDateTime = newValue
      }

      this.recurrenceConfiguration.endDate = this.addOneMonth(newInitialDate)
      this.minDateAux = newValue
    }
  },
  methods: {
    addOneMonth(date) {
      return moment(date).add(1, 'month').toDate()
    },
    handleDialogShow() {
      this.$emit('opened')
    },
    handleDialogHide() {
      this.$emit('closed')
    },
    resetForm() {
      this.title = ''
      this.description = ''
      this.roomSelected = null
      this.startDateTime = currentDateTime
      this.endDateTime = currentDateTime
      this.isRecurring = false
      this.recurrenceConfiguration = {
        endDate: null,
        selectedWeekdays: []
      }
      this.errorMessage = null
      this.headerDialog = 'Criação da reserva'
      this.isReserveEdition = false
    },
    async loadRooms() {
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
    toggleRecurrence() {
      this.isRecurring = !this.isRecurring
      if (!this.isRecurring) {
        this.recurrenceConfiguration.endDate = null
        this.recurrenceConfiguration.selectedWeekdays = []
      } else {
        this.recurrenceConfiguration.endDate = this.addOneMonth(this.startDateTime)
      }
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
      const startDateTimeFormatted = moment(this.startDateTime).format('DD-MM-yyyy, HH:mm')
      const endDateTimeFormatted = moment(this.endDateTime).format('DD-MM-yyyy, HH:mm')
      
      const body = {
        title: this.title,
        roomId: this.roomSelected._roomId,
        startDateTime: startDateTimeFormatted,
        endDateTime: endDateTimeFormatted,
        description: this.description,
        isRecurring: this.isRecurring,
        recurrence: {
          endDate: moment(this.recurrenceConfiguration.endDate).format('DD-MM-yyyy'),
          selectedWeekdays: this.recurrenceConfiguration.selectedWeekdays
        }
      }

      console.log(body)

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

<style>
.p-dialog {
  width: 50em !important;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  text-align: center;
}

.recurrence-config .weekdays-selector label {
  display: inline-block;
  margin-right: 1rem;
}

.pv-button-reservar {
  float: right;
}

@media (max-width: 1000px) {
  .p-dialog {
    width: 35em !important;
  }
}

@media (max-width: 768px) {
  .p-dialog {
    width: 25em !important;
  }
}
</style>

