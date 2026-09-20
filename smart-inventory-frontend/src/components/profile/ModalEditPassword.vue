<template>

    <div class="modal fade" id="modalEditPassword" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content p-2">

                <div class="modal-body d-flex flex-column gap-4">
                    <div class="d-flex justify-content-between">
                        <h1 class="modal-title fs-5 fw-semibold">កែប្រែពាក្យសម្ងាត់</h1>
                        <button type="button" class="btn-close shadow-none" @click="onModalClose"></button>
                    </div>
                    <form class="mb-0">

                        <div class="input-field input-group mb-4">
                            <input type="text" id="lastname" class="form-control" placeholder="" value="ភ៏ណ" />
                            <label for="lastname" class="form-label">ពាក្យសម្ងាត់</label>
                            <span class="input-group-text bg-black fs-5"><i class="bi bi-lock"></i></span>
                        </div>

                        <div class="input-field input-group mb-4">
                            <input type="text" id="firstname" class="form-control" placeholder="" value="ផាន់ណា" />
                            <label for="firstname" class="form-label">ពាក្យសម្ងាត់ថ្មី</label>
                            <span class="input-group-text bg-black fs-5"><i class="bi bi-shield-lock"></i></span>
                        </div>

                        <div class="input-field input-group ">
                            <input type="text" id="dob" class="form-control" placeholder="ជ្រើសរើសថ្ងៃខែឆ្នាំកំណើត"
                                value="26 ខែវិច្ជិកា ឆ្នាំ 2004" />
                            <label for="dob" class="form-label">បញ្ជាក់ពាក្យសម្ងាត់</label>
                            <span class="input-group-text bg-black fs-5"><i class="bi bi-shield-check"></i></span>
                        </div>

                    </form>

                    <div class="d-flex justify-content-end gap-3">
                        <button type="button" class="btn btn-secondary" @click="onModalClose()">បោះបង់</button>
                        <button type="button" class="btn btn-primary">រក្សាទុកការផ្លាស់ប្ដូរ</button>
                    </div>
                </div>

            </div>
        </div>
    </div>


</template>


<script setup>

import { useProfileStore } from '@/stores/views/profileStore';
import { Modal } from 'bootstrap';
import { onMounted } from 'vue';
const profileStore = useProfileStore();

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // import Flatpickr styles

onMounted(() => {
    profileStore.modalEditPassword = Modal.getOrCreateInstance(document.getElementById('modalEditPassword'), {
        keyboard: false,
    });

});


const onModalClose = () => {
    profileStore.modalEditPassword.hide();
}
</script>