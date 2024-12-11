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
        <InputText :disabled="loading" id="title" v-model="title" />
      </div>

      <div class="form-group">
        <label for="room">Sala</label>
        <PVSelect
          v-model="roomSelected"
          :options="roomOptions"
          optionLabel="_name"
          placeholder="Selecione a sala"
          class="w-full md:w-56"
          :disabled="loading"
        />

        <div v-if="roomSelected" class="room-resources">
          <img
            :src="'data:image/png;base64' + roomSelected._image"
            alt="Imagem da Sala"
            class="room-image"
          />
          <ul class="ul-resources">
            <p>Recursos:</p>
            <li class="li-resources" title="Número de assentos">
              <font-awesome-icon class="fa-icon-padding" :icon="['fas', 'chair']" />
              {{ roomSelected._numberOfSeats }}
            </li>
            <li
              class="li-resources"
              v-for="resource in roomSelected._resources"
              :key="resource._name"
              :title="resource._description"
            >
              <font-awesome-icon class="fa-icon-padding" :icon="getResourceIcon(resource._name)" />
              {{ resource._name }}
              <dir v-if="resource._quantity">({{ resource._quantity }})</dir>
            </li>
          </ul>
        </div>
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
          :disabled="loading || canNotModifyDate()"
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
          :disabled="loading || canNotModifyDate()"
        />
      </div>

      <div class="form-group">
        <label for="description">Descrição</label>
        <PVTextarea :disabled="loading" v-model="description" rows="5" cols="30" />
      </div>

      <div v-if="!isReserveEdition">
        <div class="form-group">
          <PVButton
            :disabled="loading"
            label="Ativar/Desativar Recorrência"
            @click="toggleRecurrence"
          />
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
              :disabled="loading"
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
                  :disabled="loading"
                />
                {{ day.label }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isReserveEdition && isRecurring">
        <PVCheckbox v-model="editAllReservations" binary />
        <label for="editAll"> Editar todas as reservas? </label>
      </div>

      <div v-if="isReserveEdition">
        <PVButton :disabled="loading" class="pv-button-reservar" @click="submit">Salvar</PVButton>
      </div>
      <div v-else>
        <PVButton :disabled="loading" class="pv-button-reservar" @click="submit">Reservar</PVButton>
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
import PVCheckbox from 'primevue/checkbox'

const currentDateTime = moment().toDate()

export default {
  name: 'ReservationForm',
  components: {
    PVDialog,
    PVButton,
    InputText,
    PVTextarea,
    PVSelect,
    DatePicker,
    PVCheckbox
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
      ignoreStartDateTimeWatch: false,
      id: null,
      title: '',
      description: '',
      roomSelected: null,
      startDateTime: currentDateTime,
      endDateTime: currentDateTime,
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
      editAllReservations: true,
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
          const room = this.roomOptions.filter((room) => room._name === newReservation.roomName)[0]
          this.ignoreStartDateTimeWatch = true
          this.id = newReservation.id
          this.title = newReservation.title
          this.description = newReservation.description
          this.roomSelected = room
          this.startDateTime = new Date(newReservation.time.start)
          this.endDateTime = new Date(newReservation.time.end)
          this.isRecurring = newReservation.isRecurring
          this.headerDialog = 'Edição da reserva'
          this.isReserveEdition = true
          if (this.isRecurring) {
            this.editAllReservations = true
          }
        } else {
          this.resetForm()
        }
      }
    },
    startDateTime(newInitialDate, oldInitialDate) {
      if (this.ignoreStartDateTimeWatch) {
        this.ignoreStartDateTimeWatch = false
        return
      }

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
        this.endDateTime = moment(newValue).add('1', 'hour').toDate()
      }

      this.recurrenceConfiguration.endDate = this.addOneMonth(newInitialDate)
      this.minDateAux = newValue
    }
  },
  methods: {
    getResourceIcon(resourceName) {
      const icons = {
        Projetor: 'video',
        'Quadro Branco': 'chalkboard',
        'Computador': 'computer'
      }
      return ['fas', icons[resourceName] || 'question-circle']
    },
    canNotModifyDate() {
      return this.editAllReservations
    },
    addOneMonth(date) {
      return moment(date).add(1, 'month').toDate()
    },
    handleDialogShow() {
      this.$emit('opened')
    },
    handleDialogHide() {
      this.$emit('closed')
    },
    save(body) {
      this.$emit('save', body)
    },
    resetForm() {
      this.editAllReservations = false
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
        (!this.startDateTime && !this.editAllReservations) ||
        (!this.endDateTime && !this.editAllReservations) ||
        !this.description
      ) {
        this.errorMessage = 'Todos os campos são obrigatórios.'
        this.loading = false
        return
      }

      if (this.isRecurring && !this.isReserveEdition) {
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
        applyToAll: this.editAllReservations,
        recurrence: {
          endDate: moment(this.recurrenceConfiguration.endDate).format('DD-MM-yyyy'),
          selectedWeekdays: this.recurrenceConfiguration.selectedWeekdays
        }
      }

      console.log(body)

      try {
        if (this.isReserveEdition) {
          await axiosInstance.put(`/v1/reservations/${this.id}`, body, {
            headers: {
              Authorization: token
            }
          })
        } else {
          await axiosInstance.post('/v1/reservations', body, {
            headers: {
              Authorization: token
            }
          })
        }

        this.save(body)
        this.visible = true
      } catch (error) {
        const response = error.response
        this.errorMessage = response.data.message
      } finally {
        this.loading = false
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

.room-resources {
  display: flex;
  padding: 10px 0;
}

.room-image {
  width: 450px;
  height: 270px;
}

.room-image > img {
  width: 100%;
  height: 100%;
}

.ul-resources {
  list-style: none;
  padding: 0px 7px;
}

.li-resources {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 10px;
  padding-top: 10px;
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

  .room-image {
    width: 100%;
  }

  .room-resources {
    flex-direction: column;
  }

  .ul-resources {
    padding-top: 10px;
    padding-left: 0;
    display: flex;
  }

  .li-resources {
    gap: 0;
    padding-left: 9px;
    padding-top: 0;
  }

  .li-resources > .fa-icon-padding {
    padding-right: 6px;
  }
}
</style>
