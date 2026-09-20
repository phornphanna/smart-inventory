import { defineStore } from "pinia";

export const useProvinceStore = defineStore('views/provinceStore',{
    state: () => ({
           modalInsert : null,
           modalUpdate: null,
            modalDelete : null
    }),
    actions: {
         
    }
});