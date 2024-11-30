import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { VueSpinner } from 'vue3-spinners'
import PrimeVue from 'primevue/config';
import Dialog from 'primevue/dialog'
import Button from "primevue/button"
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import Aura from '@primevue/themes/aura';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmDialog from 'primevue/confirmdialog';
import MultiSelect from 'primevue/multiselect';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Checkbox from 'primevue/checkbox';
import 'primeicons/primeicons.css'
import moment from 'moment-timezone'
import 'qalendar/dist/style.css';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
moment.tz.setDefault('America/Sao_Paulo')
library.add(fas)

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ConfirmationService);
app.use(ToastService)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.fake-dark-selector'
    }
  }
});
app.component(Dialog, 'PVDialog')
app.component(Button, 'PVButton')
app.component(Textarea, 'PVTextarea')
app.component(Select, 'PVSelect')
app.component(ConfirmDialog, 'PVConfirmDialog')
app.component(Toast, 'PVToast')
app.component(MultiSelect, 'PvMultiSelect')
app.component(Checkbox, 'PVCheckbox')
app.component(Accordion)
app.component(AccordionPanel)
app.component(AccordionHeader)
app.component(AccordionContent)
app.component(InputText)
app.component(VueSpinner)
app.component(VueDatePicker)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')