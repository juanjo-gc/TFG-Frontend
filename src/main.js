import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
// import BootstrapVue from "bootstrap-vue/dist/bootstrap-vue.esm";
import "bootstrap/dist/css/bootstrap.css";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
     faHeart,
     faComment
} from "@fortawesome/free-regular-svg-icons";

library.add(faHeart, faComment);


createApp(App)
    .use(router)
    .use(createPinia().use(piniaPluginPersistedState))
    .component("font-awesome-icon", FontAwesomeIcon)
    .mount("#app");
