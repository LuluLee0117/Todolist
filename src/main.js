import { createApp } from 'vue';
import App from './App.vue';
import './input.css'; // Tailwind CSS
import router from './router'; // Vue Router


createApp(App)
  .use(router)
  .mount('#app');