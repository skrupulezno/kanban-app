import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import './globals.scss';
import router from './routes';

import vuetify from './vuetify';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(vuetify);

app.mount('#app');

