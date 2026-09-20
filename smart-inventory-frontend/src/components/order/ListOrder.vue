<template>
  <div>
    <div class="table-responsive">
      <table class="table table-bordered rounded-3 table-list-order">
        <thead>
          <tr>
            <th scope="col">ផលិតផល</th>
            <th scope="col">អតិថិជន</th>
            <th scope="col">លេខកម្មង់</th>
            <th scope="col">តម្លៃសរុប</th>
            <th scope="col">ស្ថានភាព</th>
            <th scope="col">មុខងារ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in 10" :key="index">
            <td class="d-flex align-items-center gap-2">A002</td>
            <td>John</td>
            <td>Doe</td>
            <td>@social</td>
            <td>
              <span class="badge bg-warning-subtle text-warning fs-8">បោះបង់</span>
            </td>
            <td class="position-relative">
              <div class="d-flex gap-3 align-items-center">
                <div class="download-recipt-icon bg-success-subtle" title="ទាយយក">
                  <i class="bi bi-cloud-arrow-down text-success"></i>
                </div>
                <div class="view-detail-icon bg-info-subtle" title="មើលលម្អិត">
                  <i class="bi bi-eye text-info"></i>
                </div>
                <div class="status-icon bg-warning-subtle" title="ស្ថានភាព"
                     @click="toggleDropdown(index)">
                  <i class="bi bi-three-dots text-warning"></i>
                </div>
              </div>

              <!-- Dropdown -->
              <transition name="fade">
                <ul v-if="activeDropdown === index"
                    class="dropdown-menu show shadow-sm rounded p-2 position-absolute z-1 bg-white"
                    style="top: 40px; right: 0; width: 180px;">
                  <li class="dropdown-item" @click="updateStatus(index, 'បញ្ជាក់')">បញ្ជាក់</li>
                  <li class="dropdown-item" @click="updateStatus(index, 'បដិសេធ')">បដិសេធ</li>
                  <li class="dropdown-item" @click="updateStatus(index, 'ចូលនៅ')">ចូលនៅ</li>
                  <li class="dropdown-item" @click="updateStatus(index, 'ចាកចេញ')">ចាកចេញ</li>
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
  activeDropdown.value = null ;
}
</script>
