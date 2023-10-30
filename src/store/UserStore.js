import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

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
            person: {},
            profileImage: null,
            aiShownUserIds: [],
            tUpdatedUsersToShow: new Date()
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
        setFollow(user) {
            axios.patch("http://localhost:8000/api/setFollow/" + this.person._iId + "/" + user._iId)
            .then(response => {
                bFollowed = response.data;
                if(bFollowed) {
                    let notificationParams = {
                    sInfo: "¡Ahora " + this.person._sName + " te está siguiendo!",
                        iRecipientId: user._iId,
                        sType: "NewFollow",
                        iIssuerId: this.person._iId
                    }
                    axios.post("http://localhost:8000/api/newNotification", notificationParams)
                    .then(response => console.log(response.data))
                }
            })
        },
        proccessFollow(user, bFollowed) {
            if(!bFollowed) {
                if(!user._bIsPrivate) {     //Cuenta pública
                    this.setFollow(user);
                } else {
                    let notificationParams = {
                        sInfo: this.person._sName + " solicitó seguirte.",
                        iRecipientId: user._iId,
                        sType: "FollowRequest",
                        iIssuerId: this.person._iId
                    }
                    axios.post("http://localhost:8000/api/newNotification", notificationParams)
                    .then(response => console.log(response.data))
                }
            } else {
                axios.patch("http://localhost:8000/api/setFollow/" + this.person._iId + "/" + user._iId)
                .then(response => {
                    if(!response.data) {    //Siempre debe ser falso, es una comprobación por seguridad
                        //Borrar notificaciones
                        axios.patch("http://localhost:8000/api/deleteNotification/" + this.person._iId + "/" + user._iId + "/NewFollow")
                        if(user._bIsPrivate) {
                            axios.patch("http://localhost:8000/api/deleteNotification/" + this.person._iId + "/" + user._iId + "/FollowRequest")
                            axios.patch("http://localhost:8000/api/deleteNotification/" +  user._iId + "/" + this.person._iId +  "/FollowRequestAccepted")
                        }
                    }
                })
            }
        },
        reportUser(iReportedId, sUsername, sDescription) {
            axios.post("http://localhost:8000/api/newTicket", {
                sSubject: "Denuncia de usuario con nombre " + sUsername,
                sDescription,
                iIssuerId: this.person._iId,
                iReportedId,
                iEventId: -1,
                iPostId: -1,
                sCategory: 'Denunciar un usuario'
            })
        },
        softDeleteRestorePost(iPostId, iUserId, sUsername, sPost, bIsCurrentlyDeleted) {
            let bIsDeleted = !bIsCurrentlyDeleted;
            axios.patch("http://localhost:8000/api/softDeleteOrRestorePost/" + iPostId) 
            .then(response => {
                bIsDeleted = response.data;
                console.log(response.data)
                let sInformation = bIsCurrentlyDeleted ? "Se ha restaurado la publicación de @" + sUsername + ". Texto de la publicación: " + sPost :
                "Se ha eliminado una publicación de @" + sUsername + ". Texto de la publicación: " + sPost;
                let sInfo = bIsCurrentlyDeleted ? "Tu publicación con texto '" + sPost + "' que había sido borrada ha sido restaurada. Disculpa las molestias." :
                "Tu publicación con texto '" + sPost + "' ha sido eliminada por no cumplir con los términos de la plataforma."
                let sType = bIsCurrentlyDeleted ? 'Announcement' : 'BehaviorWarning';
                console.log(sInformation)
                axios.post("http://localhost:8000/api/newOperation", {
                    sInformation,
                    iAdminId: this.person._iId
                })
                axios.post("http://localhost:8000/api/newNotification", {
                    sInfo,
                    iRecipientId: iUserId,
                    iIssuerId: this.person._iId,
                    iPostId: -1,
                    iEventId: -1,
                    sType
                })
            })
            return bIsDeleted;
        },
        async checkPendingFollow(iId) {
            const bIsPending = await axios.get("http://localhost:8000/api/checkPendingFollow/" + this.person._iId + "/" + iId);
            return bIsPending.data;
        }
    },
    getters: {
        getAuth: (state) =>  state.authenticated
    }
})