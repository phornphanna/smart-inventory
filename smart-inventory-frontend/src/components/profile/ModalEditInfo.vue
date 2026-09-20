<template>

    <div class="modal fade" id="modalEditInfo" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content p-2">

                <div class="modal-body d-flex flex-column gap-4">
                    <div class="d-flex justify-content-between">
                        <h1 class="modal-title fs-5 fw-semibold">កែប្រែពត័មានផ្ទាល់ខ្លួន</h1>
                        <button type="button" class="btn-close shadow-none" @click="onModalClose"></button>
                    </div>
                    <form class="mb-0">

                        <div class="input-field input-group mb-4">
                            <input type="text" id="lastname" class="form-control" placeholder="" 
                            value="ភ៏ណ"
                            />
                            <label for="lastname" class="form-label">នាមត្រកូល</label>
                            <span class="input-group-text bg-black fs-5"><i class="bi bi-person"></i></span>
                        </div>
                        <div class="input-field input-group mb-4">
                            <input type="text" id="firstname" class="form-control" placeholder=""
                            value="ផាន់ណា"
                            />
                            <label for="firstname" class="form-label">នាមខ្លួន</label>
                            <span class="input-group-text bg-black fs-5"><i class="bi bi-person"></i></span>
                        </div>

                        <div class="input-field input-group mb-4">
                            <input type="text" id="dob" class="form-control" placeholder="ជ្រើសរើសថ្ងៃខែឆ្នាំកំណើត" 
                            value="26 ខែវិច្ជិកា ឆ្នាំ 2004"
                            />
                            <label for="dob" class="form-label">ថ្ងៃខែឆ្នាំកំណើត</label>
                            <span class="input-group-text bg-black fs-5"><i class="bi bi-calendar"></i></span>
                        </div>


                        <div class="input-field input-group mb-4">
                            <input type="text" id="phone" class="form-control" placeholder="" 
                            value="0717834347"
                            />
                            <label for="phone" class="form-label">លេខទូរសព្ទ</label>
                            <span class="input-group-text bg-black fs-5"><i class="bi bi-telephone"></i></span>
                        </div>

                        <div class="input-field input-group">
                            <input type="text" id="address" class="form-control" placeholder=""
                            value="ទូលគោក ភ្នំពេញថ្មី ភ្នំពេញ"
                            />
                            <label for="address" class="form-label">អាសយដ្ឋាន</label>
                            <span class="input-group-text bg-black fs-5"><i class="bi bi-geo-alt"></i></span>
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
import 'flatpickr/dist/flatpickr.min.css'; 

onMounted(() => {
    profileStore.modalEditInfo = Modal.getOrCreateInstance(document.getElementById('modalEditInfo'), {
        keyboard: false,
    });

    flatpickr("#dob", {
        dateFormat: "Y-m-d",
        defaultDate: "1990-01-01",
        maxDate: "today",
        locale: {
            firstDayOfWeek: 1 // Monday
        }
    });
});


const onModalClose = () => {
    profileStore.modalEditInfo.hide();
}
</script>