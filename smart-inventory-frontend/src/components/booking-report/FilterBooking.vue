<template>
  <div class="row w-100 mb-4">
    <!-- Booking Search -->
    <div class="col-12 col-lg-3 mb-3 mb-lg-0">
      <div class="input-field input-group">
        <input
          type="text"
          id="search"
          class="form-control"
          placeholder="ស្វែងរកការកក់..."
          autocomplete=""
        />
        <span class="input-group-text fs-5">
          <i class="bi bi-search"></i>
        </span>
      </div>
    </div>

    <!-- Filters -->
    <div class="col-12 col-lg-9 h-auto">
      <div class="d-flex gap-3 align-items-end justify-content-between justify-content-lg-end h-100">
        <!-- Booking Status Filter -->
        <div class="h-100">
          <select class="form-select h-100" v-model="status">
            <option value="">ស្ថានភាព</option>
            <option value="1">កក់រួច</option>
            <option value="2">កំពុងរងចាំ</option>
            <option value="3">បញ្ចប់</option>
            <option value="4">បោះបង់</option>
          </select>
        </div>

        <!-- Filter by Booking Date (Start - End) -->
        <div class="h-100">
          <flat-pickr
            v-model="startDate"
            class="form-control h-100"
            :config="dateConfig"
            placeholder="ថ្ងៃចាប់ផ្តើម"
          />
        </div>

        <div class="h-100">
          <flat-pickr
            v-model="endDate"
            class="form-control h-100"
            :config="dateConfig"
            placeholder="ថ្ងៃបញ្ចប់"
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

const dateConfig = {
  dateFormat: 'Y-m-d'
}
</script>

<style scoped>
@import 'flatpickr/dist/flatpickr.css';
</style>
