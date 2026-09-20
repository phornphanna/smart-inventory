<template>
      <div class="row w-100 mb-4">
        <div class="col-12 col-lg-3 mb-3 mb-lg-0">
          <div class="input-field input-group">
            <input type="text" id="search" class="form-control" placeholder="ស្វែករក..."
            autocomplete=""
            />
            <span class="input-group-text fs-5">
              <i class="bi bi-search"></i>
            </span>
          </div>
        </div>
    
        <div class="col-12 col-lg-9 h-auto">
          <div class="d-flex gap-3  align-items-end justify-content-between justify-content-lg-end   h-100">
            <div class="h-100">
              <select class="form-select h-100" v-model="status">
                <option value="">ស្ថានភាព</option>
                <option value="1">Accept</option>
                <option value="2">Pending</option>
                <option value="3">Complete</option>
                <option value="4">Reject</option>
                <option value="5">cancle</option>
              </select>
            </div>
            <div class="h-100">
              <flat-pickr
                v-model="startDate"
                class="form-control h-100"
                :config="dateConfig"
                placeholder="Start Date"
              />
            </div>
    
            <div class="h-100">
              <flat-pickr
                v-model="endDate"
                class="form-control h-100"
                :config="dateConfig"
                placeholder="End Date"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <script setup>
    import { ref } from 'vue'
    import FlatPickr from 'vue-flatpickr-component'
    import 'flatpickr/dist/flatpickr.css'
    
    const status = ref('')
    const startDate = ref(null)
    const endDate = ref(null)


const activeDropdown = ref(null)

function toggleDropdown(index) {
  activeDropdown.value = activeDropdown.value === index ? null : index
}

function updateStatus(index, status) {
  activeDropdown.value = null 
}
    
    const dateConfig = {
      dateFormat: 'Y-m-d'
    }
    </script>
    
    <style scoped>
    @import 'flatpickr/dist/flatpickr.css';
    </style>
    