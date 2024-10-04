<template>
  <h2>Reservar sala</h2>

  <div>
    <label>Titulo</label>
    <input type="text" />
    <label>Data e hora Inicio</label>
    <VueDatePicker v-model="minDate" :format="format" :minDate="minDate" :timezone="timezone" />
    <label>Data e hora Fim</label>
    <VueDatePicker v-model="maxDate" :start-date="dateSuggestion" :format="format" :timezone="timezone" />
    <label>Descricao</label>
    <input type="text" maxlength="300" />
  </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker'
import moment from 'moment'
const todayDate = moment().format('MM-DD-yyyy, HH:mm')
const timePlusOneHour = moment().add(1, 'hour').format('MM-DD-yyyy, HH:mm')

export default {
  components: {
    VueDatePicker
  },
  data() {
    return {
      minDate: todayDate,
      dateSuggestion: timePlusOneHour,
      maxDate: todayDate,
      timezone: 'America/Sao_Paulo',
      format: 'dd/MM/yyyy HH:mm'
    }
  },
  methods: {}
}
</script>