<template>
  <div>
    <div class="table-responsive">
      <table class="table table-bordered rounded-3 table-list-order">
        <thead>
          <tr>
            <th scope="col">បន្ទប់/ផ្ទះ</th>
            <th scope="col">អតិថិជន</th>
            <th scope="col">លេខកូដកក់</th>
            <th scope="col">តម្លៃជួលសរុប</th>
            <th scope="col">ស្ថានភាព</th>
            <th scope="col">មុខងារ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in 10" :key="item">
            <td class="d-flex align-items-center gap-2">ផ្ទះលេខ A002</td>
            <td>John Doe</td>
            <td>BK-100{{ item }}</td>
            <td>$250</td>
            <td>
              <span class="badge bg-warning-subtle text-warning fs-8">កំពុងរងចាំ</span>
            </td>
            <td class="position-relative">
              <div class="d-flex gap-3 align-items-center">
                <!-- Download Receipt -->
                <div class="download-recipt-icon bg-success-subtle" title="ទាញយកវិក័យបត្រ">
                  <i class="bi bi-cloud-arrow-down text-success"></i>
                </div>

                <!-- View Details -->
                <div class="view-detail-icon bg-info-subtle" title="មើលព័ត៌មានលម្អិត">
                  <i class="bi bi-eye text-info"></i>
                </div>

                <!-- Status Menu Trigger -->
                <div class="status-icon bg-warning-subtle" title="ប្ដូរស្ថានភាព" @click="toggleDropdown(index)">
                  <i class="bi bi-three-dots text-warning"></i>
                </div>
              </div>

              <!-- Dropdown Menu with Transition -->
              <transition name="fade">
                <ul
                  v-if="activeDropdown === index"
                  class="dropdown-menu show shadow-sm rounded p-2 position-absolute z-1 bg-white"
                  style="top: 40px; right: 0; width: 180px;"
                >
                  <li class="dropdown-item" @click="updateStatus(index, 'បានបញ្ជាក់')">បានបញ្ជាក់</li>
                  <li class="dropdown-item" @click="updateStatus(index, 'បានបដិសេធ')">បានបដិសេធ</li>
                  <li class="dropdown-item" @click="updateStatus(index, 'បានចូលនៅ')">បានចូលនៅ</li>
                  <li class="dropdown-item" @click="updateStatus(index, 'បានចាកចេញ')">បានចាកចេញ</li>
                  <li class="dropdown-item" @click="updateStatus(index, 'មិនបានមក')">មិនបានមក</li>
                </ul>
              </transition>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeDropdown = ref(null)

function toggleDropdown(index) {
  activeDropdown.value = activeDropdown.value === index ? null : index
}

function updateStatus(index, status) {
  console.log(`Update status for item ${index} to ${status}`)
  activeDropdown.value = null
}
</script>
