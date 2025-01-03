import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { host } from "../../config"


export const useUserStore = defineStore({
    id: 'user',
    state: () => {
        return {
            person: {},
            aiShownUserIds: [],
            tUpdatedUsersToShow: null,
            router: useRouter(),
            baseAPIurl: "http://" + host + ":8000/api/"
        };
      },
    persist: true,
    //   persist: {
    //     storage: sessionStorage,
    //   },
    actions: {
        getProfileImage() {
            axios.get(this.baseAPIurl + "getProfileImage")
            .then(response => {
                this.profileImage = response.data;
            })
            .catch(error => console.log(error))
        },
        logout() {
            this.person = {};
            location.reload();
        },
        setFollow(user) {
            axios.patch(this.baseAPIurl + "setFollow/" + this.person._iId + "/" + user._iId)
            .then(response => {
                let bFollowed = response.data;
                if(bFollowed) {
                    let notificationParams = {
                    sInfo: "¡Ahora " + this.person._sName + " te está siguiendo!",
                        iRecipientId: user._iId,
                        sType: "NewFollow",
                        iIssuerId: this.person._iId
                    }
                    axios.post(this.baseAPIurl + "newNotification", notificationParams)
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
                    axios.post(this.baseAPIurl + "newNotification", notificationParams)
                    .then(response => console.log(response.data))
                }
            } else {
                axios.patch(this.baseAPIurl + "setFollow/" + this.person._iId + "/" + user._iId)
                .then(response => {
                    if(!response.data) {    //Siempre debe ser falso, es una comprobación por seguridad
                        //Borrar notificaciones
                        axios.patch(this.baseAPIurl + "deleteNotification/" + this.person._iId + "/" + user._iId + "/NewFollow")
                        if(user._bIsPrivate) {
                            axios.patch(this.baseAPIurl + "deleteNotification/" + this.person._iId + "/" + user._iId + "/FollowRequest")
                            axios.patch(this.baseAPIurl + "deleteNotification/" +  user._iId + "/" + this.person._iId +  "/FollowRequestAccepted")
                        }
                    }
                })
            }
        },
        reportUser(iReportedId, sUsername, sDescription) {
            axios.post(this.baseAPIurl + "newTicket", {
                sSubject: "Denuncia de usuario con nombre " + sUsername,
                sDescription,
                iIssuerId: this.person._iId,
                iReportedId,
                iEventId: -1,
                iPostId: -1,
                sCategory: 'Denunciar un usuario'
            })
            .then(response => console.log("Se ha enviado el report"))
        },
        softDeleteRestorePost(iPostId, iUserId, sUsername, sPost, bIsCurrentlyDeleted) {
            let bIsDeleted = !bIsCurrentlyDeleted;
            axios.patch(this.baseAPIurl + "softDeleteOrRestorePost/" + iPostId) 
            .then(response => {
                bIsDeleted = response.data;
                console.log(response.data)
                let sInformation = bIsCurrentlyDeleted ? "Se ha restaurado la publicación de @" + sUsername + ". Texto de la publicación: " + sPost :
                "Se ha eliminado una publicación de @" + sUsername + ". Texto de la publicación: " + sPost;
                let sInfo = bIsCurrentlyDeleted ? "Tu publicación con texto '" + sPost + "' que había sido borrada ha sido restaurada. Disculpa las molestias." :
                "Tu publicación con texto '" + sPost + "' ha sido eliminada por no cumplir con los términos de la plataforma."
                let sType = bIsCurrentlyDeleted ? 'Announcement' : 'BehaviorWarning';
                console.log(sInformation)
                axios.post(this.baseAPIurl + "newOperation", {
                    sInformation,
                    iAdminId: this.person._iId
                })
                axios.post(this.baseAPIurl + "newNotification", {
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
        softDeleteOrRestoreImage(iImageId, iUserId, sUsername, bPhotoFromProfile, iEventId) {
            let bIsDeleted = false;
            
            axios.patch(this.baseAPIurl + "softDeleteOrRestoreImage/" + iImageId)
            .then(response => {
                console.log("Se ejecuta en US")
                bIsDeleted = response.data; // return != null => true si esta borrado, false si no
                let sType = bIsDeleted ? 'BehaviorWarning' : 'Announcement';
                let sInfo = "";
                let sInformation = "";
                console.log("bIsDeleted: " + bIsDeleted + " Response.data: " + response.data);
                if(bIsDeleted) {
                    sInformation = bPhotoFromProfile ? "Se ha eliminado una foto del perfil de @" + sUsername + "." :
                    "Se ha eliminado la foto con ID " + iImageId + " subida por el usuario @" + sUsername + " en el evento con ID " + iEventId;
                    sInfo = bPhotoFromProfile ? "Una de las fotos de tu perfil ha sido eliminada por no cumplir con los términos de nuestra plataforma." :
                    "Una de las fotos que has subido a un evento ha sido eliminada por no cumplir con los términos de nuestra plataforma.";
                } else {
                    sInformation = "Se ha restaurado la foto con ID " + iImageId + " que había subido el usuario @" + sUsername + ".";
                    sInfo = "Una de tus fotos que había sido borrada ha sido restaurada. Disculpa las molestias.";
                }
                axios.post(this.baseAPIurl + "newOperation", {
                    sInformation,
                    iAdminId: this.person._iId
                })
                axios.post(this.baseAPIurl + "newNotification", {
                    sInfo,
                    iRecipientId: iUserId,
                    iIssuerId: this.person._iId,
                    iPostId: -1,
                    iEventId: -1,
                    sType: 'BehaviorWarning'
                })
            })
        },
        async checkPendingFollow(iId) {
            const bIsPending = await axios.get(this.baseAPIurl + "checkPendingFollow/" + this.person._iId + "/" + iId);
            return bIsPending.data;
        }
    },
    getters: {
        getAuth: (state) =>  state.authenticated
    }
})