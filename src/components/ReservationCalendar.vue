<template>
  <PVDialog
    v-model:visible="visible"
    :showHeader="false"
    class="responsive-dialog"
    :breakpoints="{
      '1400px': '50vw',
      '1200px': '60vw',
      '992px': '70vw',
      '768px': '80vw',
      '575px': '90vw'
    }"
  >
    <div class="dialog-content">
      <p class="dialog-message" v-if="isEdit">
        <i class="pi pi-check">Reserva editada com sucesso!</i>
      </p>
      <p class="dialog-message" v-else-if="!isEdit">
        <i class="pi pi-check">Reserva criada com sucesso!</i>
      </p>
      <p class="dialog-message" v-else-if="errorMessage">
        {{ errorMessage }}
      </p>

      <PVButton
        icon="pi pi-times"
        class="p-button-rounded p-button-text close-button"
        @click="visible = false"
      />
    </div>
  </PVDialog>

  <div class="container-reservation-calendar">
    <div class="options">
      <div>
        <PVButton label="Reservar sala" @click="onCreateReservation" class="reserve-button" />
      </div>
      <div class="filters">
        <Accordion value="0">
          <AccordionPanel value="0">
            <AccordionHeader>Filtros</AccordionHeader>
            <AccordionContent>
              <PvMultiSelect
                v-model="selectedRooms"
                :options="roomOptions"
                optionLabel="_name"
                placeholder="Selectione as salas"
                :maxSelectedLabels="3"
                class="w-full md:w-30rem room-filter"
                :filter="true"
                :invalid="invalidRoomFilter"
                :disabled="loading"
              />
              <div v-if="invalidRoomFilter" class="error-message">
                {{ 'Filtro obrigatorio' }}
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </div>

    <ReservationForm
      :visible="showForm"
      :reservation="selectedReservation"
      :isEdit="isEdit"
      @update:visible="showForm = $event"
      @save="handleSave"
      @closed="handleDialogClosed"
    />

    <div class="is-light-mode calendar-wrapper">
      <Qalendar
        :events="reservations"
        :config="config"
        :is-loading="loading"
        @delete-event="onDeleteEvent"
        @edit-event="onEditEvent"
      />

      <PVToast />
      <PVConfirmDialog></PVConfirmDialog>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/services/http'
import { useAuthStore } from '@/stores/auth'
import PVDialog from 'primevue/dialog'
import PVButton from 'primevue/button'
import { Qalendar } from 'qalendar'
import PVConfirmDialog from 'primevue/confirmdialog'
import PVToast from 'primevue/toast'
import PvMultiSelect from 'primevue/multiselect'
import ReservationForm from './ReservationForm.vue'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import '../assets/reservationcalendar.css'

export default {
  components: {
    PVDialog,
    PVButton,
    Qalendar,
    PVConfirmDialog,
    PVToast,
    ReservationForm,
    PvMultiSelect,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent
  },
  data() {
    return {
      visible: false,
      errorMessage: null,
      loading: true,
      reservations: [],
      eventToDelete: null,
      deleteDialogVisible: false,
      selectedReservation: null,
      roomOptions: [],
      selectedRooms: null,
      invalidRoomFilter: false,
      showForm: false,
      isEdit: false,
      config: {
        defaultMode: 'week',
        showCurrentTime: true,
        locale: 'pt-BR'
      }
    }
  },
  async created() {
    await this.loadRooms()
    await this.loadReservations()
  },
  watch: {
    selectedRooms: {
      async handler() {
        if (this.selectedRooms == null || this.selectedRooms.length == 0) {
          this.invalidRoomFilter = true
        } else {
          this.invalidRoomFilter = false
          await this.loadReservations()
        }
      }
    }
  },
  methods: {
    onEditEvent(eventId) {
      const reservation = this.reservations.find((reservation) => reservation.id === eventId)
      if (reservation) {
        this.selectedReservation = reservation
        this.isEdit = true
        this.showForm = true
      }
    },
    handleSave() {
      this.visible = true
      this.showForm = false
    },
    handleDialogClosed() {
      this.selectedReservation = null
      this.loadReservations()
    },
    onCreateReservation() {
      this.showForm = true
      this.isEdit = false
    },
    onDeleteEvent(eventId) {
      this.eventIdToDelete = eventId
      this.$confirm.require({
        message: 'Deseja remover esta reserva?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
          label: 'Cancelar',
          severity: 'secondary',
          outlined: true
        },
        acceptProps: {
          label: 'Deletar'
        },
        accept: () => {
          this.confirmDelete()
        }
      })
    },
    async confirmDelete() {
      if (!this.eventIdToDelete) return

      this.loading = true

      try {
        const authStore = useAuthStore()
        const token = authStore.getToken().value

        await axiosInstance.delete(`/v1/reservations/${this.eventIdToDelete}`, {
          headers: {
            Authorization: token
          }
        })

        this.deleteDialogVisible = false
        this.eventIdToDelete = null
        this.loading = false
        this.$toast.add({
          severity: 'info',
          summary: 'Removido',
          detail: 'A reserva foi removida',
          life: 3000
        })
        this.loadReservations()
      } catch (error) {
        this.errorMessage = 'Erro ao excluir a reserva. Tente novamente.'
        this.loading = false
      }
    },
    async loadReservations() {
      try {
        this.loading = true

        const authStore = useAuthStore()
        const token = authStore.getToken().value
        let urlBase = '/v1/reservations'

        this.selectedRooms.forEach((element, index) => {
          if (index == 0) {
            urlBase += '?roomsId=' + element._roomId
          } else {
            urlBase += '&roomsId=' + element._roomId
          }
        })

        const response = await axiosInstance.get(urlBase, {
          headers: {
            Authorization: token
          }
        })

        if (response.data) {
          let reservations = []
          for (const reservation of response.data) {
            reservations.push({
              id: reservation.id,
              title: reservation.title,
              description: reservation.description,
              location: reservation.roomName + ' - ' + reservation.locationAddress,
              color: 'blue',
              isEditable: true,
              isRecurring: reservation.isRecurring,
              roomName: reservation.roomName,
              time: {
                start: reservation.startDateTime,
                end: reservation.endDateTime
              }
            })
          }
          this.reservations = reservations
          console.log(this.reservations)
        }
      } catch (error) {
        this.visible = true
        this.errorMessage =
          'Erro ao carregar as opções de salas. Por favor, tente novamente mais tarde.'
        console.error(error)
      } finally {
        this.loading = false
      }
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
          this.selectedRooms = [this.roomOptions[0]]
        }
      } catch (error) {
        this.visible = true
        this.errorMessage =
          'Erro ao carregar as opções de salas. Por favor, tente novamente mais tarde.'
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
