<template>
     <div class="d-flex justify-content-between align-items-center mt-2">
 
          <div>
               ចំនួនទិន្នន័យសរុប 120
          </div>

     <div>
          <Paginate
         :page-count="totalPages"
         :click-handler="handlePageClick"
         :prev-text="'ត្រឡប់ក្រោយ'"
         :next-text="'បន្ទាប់'"
         :container-class="'pagination'"
         :page-class="'page-item'"
         :page-link-class="'page-link'"
         :prev-class="'page-item'"
         :prev-link-class="'page-link'"
         :next-class="'page-item'"
         :next-link-class="'page-link'"
         :active-class="'active'"
       />
     </div>

     </div>
   </template>
   
<script setup>
import Paginate from 'vuejs-paginate-next'
import { ref } from 'vue'

const currentPage = ref(1)
const totalPages = ref(10)

const handlePageClick = (page) => {
  currentPage.value = page
  console.log('Selected Page:', page)
}
</script>



