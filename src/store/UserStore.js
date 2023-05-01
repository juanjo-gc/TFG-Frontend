import { defineStore } from "pinia";
import { axios } from 'axios';
import { reactive } from "vue";

export const useUserStore = defineStore({
    id: 'user',
    // state: () => ({
    //     authenticated: false,
    //     email: '',
    //     password: '',
    //     person: reactive({})
    // }),
    state: () => {
        return {
            person: reactive({}),
            profileImage: null
        };
      },
    persist: true,
    //   persist: {
    //     storage: sessionStorage,
    //   },
    actions: {
        getProfileImage() {
            axios.get("http://localhost:8000/api/getProfileImage")
            .then(response => {
                this.profileImage = response.data;
            })
            .catch(error => console.log(error))
        },
        logout() {
            this.person = {};
            this.profileImage = null;
            console.log("Se ejecuta logout");
            location.reload();
        },
    },
    getters: {
        getAuth: (state) =>  state.authenticated
    }
})