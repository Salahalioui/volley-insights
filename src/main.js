import '../src/assets/tailwind.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { defineRule } from 'vee-validate';
import { required, numeric } from '@vee-validate/rules';
import '@fortawesome/fontawesome-free/css/all.css';


defineRule('required', required);
defineRule('numeric', numeric);

createApp(App).use(router).mount('#app')
