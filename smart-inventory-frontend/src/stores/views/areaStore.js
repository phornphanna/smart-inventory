import { defineStore } from "pinia";

export const useAreaStore = defineStore('views/areaStore',{
    state: () => ({
           modalInsert : null,
           modalUpdate: null,
           modalDelete : null
    }),
    actions: {
         
    }
});