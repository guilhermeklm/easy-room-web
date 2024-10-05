<template>
  <h2>Reservar sala</h2>

  <div>
    <label>Titulo</label>
    <input type="text" />
    <label>Data e hora Inicio</label>
    <VueDatePicker v-model="minDate" :format="format" :minDate="todayDate" :timezone="timezone" />
    <label>Data e hora Fim</label>
    <VueDatePicker v-model="maxDate" :format="format" :minDate="minDateAux" :timezone="timezone" />
    <label>Descricao</label>
    <input type="text" maxlength="300" />
  </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker'
import moment from 'moment'
const todayDate = moment().format('MM-DD-yyyy, HH:mm')

export default {
  components: {
    VueDatePicker
  },
  data() {
    return {
      minDate: todayDate,
      maxDate: todayDate,
      todayDate: todayDate,
      minDateAux: todayDate,
      timezone: 'America/Sao_Paulo',
      format: 'dd/MM/yyyy HH:mm'
    }
  },
  watch: {
    minDate(newInitialDate, oldInitialDate) {
      const newValue = moment(newInitialDate).format('MM-DD-yyyy, HH:mm')
      if (newValue > oldInitialDate) {
        this.maxDate = newValue
      }
      this.minDateAux = newValue
    }
  }
}
</script>