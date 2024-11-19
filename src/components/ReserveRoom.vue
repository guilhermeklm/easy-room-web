<template>
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

  <PVButton label="Reservar sala" @click="showForm = true" />
  <ReservationForm
    :visible="showForm"
    :reservation="selectedReservation"
    :isEdit="isEdit"
    @update:visible="showForm = $event"
    @save="handleSave"
    @opened="handleDialogOpened"
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
</template>

<script>
import axiosInstance from '@/services/http'
import { useAuthStore } from '@/stores/auth'
import PVDialog from 'primevue/dialog'
import PVButton from 'primevue/button'
import { Qalendar } from 'qalendar'
import PVConfirmDialog from 'primevue/confirmdialog'
import PVToast from 'primevue/toast'
import ReservationForm from './ReservationForm.vue'

export default {
  components: {
    PVDialog,
    PVButton,
    Qalendar,
    PVConfirmDialog,
    PVToast,
    ReservationForm
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
    await this.loadReservations()
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
    handleSave(data) {
      console.log('Reserva salva:', data)
      this.showForm = false
      this.selectedReservation = null
      this.isEdit = false
      this.loadReservations()
    },
    handleDialogOpened() {
      console.log('O diálogo foi aberto!')
    },
    handleDialogClosed() {
      this.showForm = false
      this.selectedReservation = null
      this.isEdit = false
      console.log('O diálogo foi fechado!')
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
        const authStore = useAuthStore()
        const token = authStore.getToken().value

        const response = await axiosInstance.get('/v1/reservations', {
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
              time: {
                start: reservation.startDateTime,
                end: reservation.endDateTime
              }
            })
          }
          this.reservations = reservations
        }
      } catch (error) {
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

/* Estilo para a sobreposição de exclusão */
.delete-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Fundo semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Assegura que o spinner fique sobre outros conteúdos */
}

/* Estilo do spinner de exclusão */
.delete-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
