<template>

    <div class="modal fade" id="modalUpdateProvince" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog ">
            <div class="modal-content p-2">

                <div class="modal-body d-flex flex-column gap-4">
                    <div class="d-flex justify-content-between">
                        <h1 class="modal-title fs-5 fw-semibold">បង្កើតខេត្ត</h1>
                        <button type="button" class="btn-close shadow-none" @click="onModalClose"></button>
                    </div>
                    <form class="mb-0">
                        <div class="input-field input-group mb-4">
                            <input type="text" id="province" class="form-control" placeholder="" value="បាត់ដំបង"  />
                            <label for="province" class="form-label">ខេត្ត</label>
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

import { useProvinceStore } from '@/stores/views/provinceStore';
import { Modal } from 'bootstrap';
import { onMounted } from 'vue';
const provinceStore = useProvinceStore();


onMounted(() => {
    provinceStore.modalUpdate = Modal.getOrCreateInstance(document.getElementById('modalUpdateProvince'), {
        keyboard: false,
    });

});


const onModalClose = () => {
    provinceStore.modalUpdate.hide();
}
</script>