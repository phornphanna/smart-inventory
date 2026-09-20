import ModalEditPassword from "@/components/profile/ModalEditPassword.vue";
import { defineStore } from "pinia";

export const useProfileStore = defineStore("views/profileStore", {
      
    state: () => ({
     
    modalEditInfo: null,
    modalEditPassword: null
        
    }),
    actions: {

    }
});