<template>

    <div class="modal fade" id="modalAddOption" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content p-2">

                <div class="modal-body d-flex flex-column gap-4">
                    <div class="d-flex justify-content-between">
                        <h1 class="modal-title fs-5 fw-semibold">បង្កើតជម្រើសបន្ថែម</h1>
                        <button type="button" class="btn-close shadow-none" @click="onModalClose"></button>
                    </div>
                    <form class="mb-0">

                        <div class="input-field input-group mb-4">
                            <input type="text" id="option" class="form-control" placeholder=""  />
                            <label for="option" class="form-label">ជម្រើសបន្ថែម</label>
                            <span class="input-group-text bg-black fs-5"><i class="bi bi-three-dots"></i></span>
                        </div>
                    </form>
                    <div class="d-flex justify-content-end gap-3">
                        <button type="button" class="btn btn-secondary" @click="onModalClose()">បោះបង់</button>
                        <button type="button" class="btn btn-primary">បង្កើត</button>
                    </div>
                </div>
            </div>
        </div>
    </div>


</template>


<script setup>

import { useOptionStore } from '@/stores/views/optionStore';
import { Modal } from 'bootstrap';
import { onMounted } from 'vue';
const optionStore = useOptionStore();


onMounted(() => {
    optionStore.modalInsert = Modal.getOrCreateInstance(document.getElementById('modalAddOption'), {
        keyboard: false,
    });

});


const onModalClose = () => {
    optionStore.modalInsert.hide();
}
</script>