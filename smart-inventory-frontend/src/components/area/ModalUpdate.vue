<template>

    <div class="modal fade" id="modalUpdateArea" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content p-2">
                <div class="modal-body d-flex flex-column gap-4">
                    <div class="d-flex justify-content-between">
                        <h1 class="modal-title fs-5 fw-semibold">បង្កើតតំបន់</h1>
                        <button type="button" class="btn-close shadow-none" @click="onModalClose"></button>
                    </div>
                    <form class="mb-0">

                        <div class="input-field input-group mb-4">
                            <input type="text" id="area" class="form-control" placeholder="" value="សែនសុខ" />
                            <label for="area" class="form-label">តំបន់</label>
                            <span class="input-group-text bg-black fs-5"><i class="bi bi-map"></i></span>
                        </div>
                    </form>
                    <div class="d-flex justify-content-end gap-3">
                        <button type="button" class="btn btn-secondary" @click="onModalClose()">បោះបង់</button>
                        <button type="button" class="btn btn-primary">រក្សាទុក</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>

import { useAreaStore } from '@/stores/views/areaStore';
import { Modal } from 'bootstrap';
import { onMounted } from 'vue';
const   areaStore = useAreaStore();

onMounted(() => {
    areaStore.modalUpdate = Modal.getOrCreateInstance(document.getElementById('modalUpdateArea'), {
        keyboard: false,
    });

});


const onModalClose = () => {
    areaStore.modalUpdate.hide();
}
</script>