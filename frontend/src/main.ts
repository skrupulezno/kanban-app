import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import './globals.scss';
import router from './routes';

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

const app = createApp(App);
const pinia = createPinia();

app.use(PrimeVue);

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});


app.use(pinia);
app.use(router);

app.mount('#app');

