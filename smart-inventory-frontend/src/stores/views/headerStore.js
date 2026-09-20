import { defineStore } from "pinia";

 export const useHeaderStore  = defineStore('views/headerStore',{
    state: () =>({
        modalSearch: null,
        dropdownProfile : null
    })
 });