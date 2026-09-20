<template>
    <div class="row w-100 mb-4">
        <!-- Star Rating Filter -->
        <div class="col-12 col-lg-4 mb-3 mb-lg-0">
            <select class="form-select" v-model="rating">
                <option value="">⭐ ដាក់ចំណាត់ថ្នាក់</option>
                <option value="5">⭐⭐⭐⭐⭐ 5</option>
                <option value="4">⭐⭐⭐⭐ 4</option>
                <option value="3">⭐⭐⭐ 3</option>
                <option value="2">⭐⭐ 2</option>
                <option value="1">⭐ 1</option>
            </select>
        </div>

        <!-- Property Filter -->
        <div class="col-12 col-lg-8 mb-3 mb-lg-0 d-flex gap-2 justify-content-end">

            <div>
                <select class="form-select" v-model="property">
                    <option value="">ជ្រើសរើសអចលនទ្រព្យ</option>
                    <option v-for="(prop, index) in propertyList" :key="index" :value="prop">
                        {{ prop }}
                    </option>
                </select>
            </div>

            <div>
                <select class="form-select" v-model="sortBy">
                    <option value="">តម្រៀបតាម</option>
                    <option value="recent">ថ្មីបំផុត</option>
                    <option value="highest">ចំណាត់ថ្នាក់ខ្ពស់បំផុត</option>
                    <option value="lowest">ចំណាត់ថ្នាក់ទាបបំផុត</option>
                </select>
            </div>

        </div>

        <!-- Date Range Filter -->
        <!-- <div class="col-12 col-lg-4 d-flex gap-2 mb-3 mb-lg-0">
        <flat-pickr
          v-model="startDate"
          class="form-control"
          :config="dateConfig"
          placeholder="ថ្ងៃចាប់ផ្តើម"
        />
        <flat-pickr
          v-model="endDate"
          class="form-control"
          :config="dateConfig"
          placeholder="ថ្ងៃបញ្ចប់"
        />
      </div> -->

        <!-- Sort By -->

    </div>
</template>

<script setup>
import { ref } from 'vue'
import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

// Filter states
const rating = ref('')
const property = ref('')
const startDate = ref(null)
const endDate = ref(null)
const sortBy = ref('')

// Property list example (can be dynamic)
const propertyList = ref([
    'ផ្ទះលេខ A001',
    'ផ្ទះលេខ A002',
    'បន្ទប់លេខ B101',
    'បន្ទប់លេខ B102'
])

const dateConfig = {
    dateFormat: 'Y-m-d'
}
</script>

<style scoped>
@import 'flatpickr/dist/flatpickr.css';
</style>