import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth/authStore", {
      
    state: () => ({
    //  block declare variable modal 
    modalSignup : null,
    modalLogout : null
    }),
    actions: {

    }
});