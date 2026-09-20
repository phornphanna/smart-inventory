<template>
    <div class="modal fade" id="modalDelete" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body d-flex flex-column">
                    <h1 class="modal-title fs-5 fw-semibold text-center">តើអ្នកប្រាកដថាចង់លុបដែររឺទេ ?</h1>
                    <p class="text-muted text-center mb-0 fs-7">នៅពេលលុប វានឹងត្រូវលុបចោលយ៉ាងអចិន្រ្តៃយ៍</p>

                    <div class="d-flex justify-content-end gap-3 mt-3">
                        <button type="button" class="btn btn-outline-danger w-100" @click="onCloseModal">បោះបង់</button>
                        <button type="button" class="btn btn-danger w-100">លុប</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>

import { onMounted } from 'vue';
import { useOptionStore } from  '@/stores/views/optionStore';
import { Modal } from 'bootstrap';

const optionStore = useOptionStore();

onMounted(() => {
  optionStore.modalDelete = Modal.getOrCreateInstance(document.getElementById('modalDelete'));

})

const onCloseModal = () => {
    optionStore.modalDelete.hide();
}

</script>