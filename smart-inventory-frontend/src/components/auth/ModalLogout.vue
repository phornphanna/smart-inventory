<template>
    <div class="modal fade" id="modalLogout" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-body d-flex flex-column">
                    <h1 class="modal-title fs-5 fw-semibold text-center">ចាកចេញ</h1>
                    <p class="text-muted text-center mb-0">តើអ្នកប្រាកដទេថាចង់ចាកចេញ ?</p>

                    <div class="d-flex justify-content-end gap-3 mt-3">
                        <button type="button" class="btn btn-outline-danger w-100" @click="onCloseModal">បោះបង់</button>
                        <button type="button" class="btn btn-danger w-100">ចាកចេញ</button>
                    </div>

                </div>

            </div>
        </div>
    </div>
</template>


<script setup>

import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/views/auth/authStore';
import { Modal } from 'bootstrap';

const authStore = useAuthStore();

onMounted(() => {
    authStore.modalLogout = Modal.getOrCreateInstance(document.getElementById('modalLogout'));

})

const onCloseModal = () => {
    authStore.modalLogout.hide();
}

</script>