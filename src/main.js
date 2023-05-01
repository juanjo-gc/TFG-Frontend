import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
// import BootstrapVue from "bootstrap-vue/dist/bootstrap-vue.esm";
import "bootstrap/dist/css/bootstrap.css";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";


createApp(App)
    .use(router)
    .use(createPinia().use(piniaPluginPersistedState))
    .mount("#app");
