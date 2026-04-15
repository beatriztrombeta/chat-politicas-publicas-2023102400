import './assets/styles/global.css'

import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router/index.js'
import axios from 'axios'

import english from './languages/english'
import portuguese from './languages/portuguese'
import spanish from './languages/spanish'


const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'pt-BR',
  fallbackLocale: 'pt-BR',
  messages: {
    'pt-BR': portuguese.messages,
    'en-UK': english.messages,
    'es-ES': spanish.messages
  },
});

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_API_URL;

createApp(App)
  .use(router)
  .use(i18n)
  .mount('#app')
