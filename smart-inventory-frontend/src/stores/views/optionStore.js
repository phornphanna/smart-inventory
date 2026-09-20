import { defineStore } from "pinia";

export const useOptionStore = defineStore('views/optionStore',{
    state: () => ({
         modalInsert: null,
         modalUpdate: null,
         modalDelete : null
    }),
    actions: {
         
    }
});