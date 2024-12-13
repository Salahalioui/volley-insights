import '../src/assets/tailwind.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { defineRule } from 'vee-validate';
import { required, numeric } from '@vee-validate/rules';
import '@fortawesome/fontawesome-free/css/all.css';
import { createI18n } from 'vue-i18n'; // Import Vue I18n

// Import your translation files
import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';
import './registerServiceWorker'

// Define VeeValidate rules
defineRule('required', required);
defineRule('numeric', numeric);

// Set up Vue I18n
const i18n = createI18n({
  legacy: false, // Set this to false
  globalInjection: true, // This allows you to use $t in templates
  locale: 'en', // Set the default language
  fallbackLocale: 'en', // Fallback language
  messages: {
    en,
    fr,
    ar
  }
});

// Create and mount the app
createApp(App)
  .use(router)
  .use(i18n) // Use i18n in your app
  .mount('#app');
