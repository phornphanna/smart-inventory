<template>
    <div class=" container vh-100 d-flex justify-content-center align-items-center">
        <div class="login col-12 col-lg-4 text-center px-3 px-lg-0">
            <div class="mx-auto text-center mb-3">
                <img src="/logo.png" class=" object-fit-cover" width="120" alt="">
            </div>
            <div class="mb-5">
                <h3 class=" fw-bold">ប្ដូរលេខសម្ងាត់ថ្មី​</h3>
            </div>
            <form action="">
                <div class="input-field input-group mb-4">
                  <input :type="password ? 'password' : 'text'" id="password" class="form-control" placeholder="" />
                  <label for="password" class="form-label">ពាក្យសម្ងាត់ថ្មី</label>
                  <span class="input-group-text bg-black fs-5" @click="changeIconPassword">
                    <i class="bi" :class="password ? 'bi-eye-slash' : 'bi-eye'"></i>
                  </span>
                </div>
                <div class="input-field input-group mb-4">
                  <input :type="password2 ? 'password' : 'text'" id="password2" class="form-control" placeholder="" />
                  <label for="password2" class="form-label">ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់</label>
                  <span class="input-group-text bg-black fs-5" @click="changeIconPassword2">
                    <i class="bi" :class="password2 ? 'bi-eye-slash' : 'bi-eye'"></i>
                  </span>
                </div>
                <div class="mb-4">
                    <button type="submit" class="btn w-100 py-2 btn-primary btn-block rounded-2 mb-4">រក្សារទុក</button>
                    <button type="submit" class="btn  border-0 w-100 py-2 text-primary bg-subtable btn-block rounded-2">
                        បោះបង់
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>

 import { ref } from 'vue';

const password = ref(true);
const password2 = ref(true);
const confirmPassword = ref(true);
const confirmPassword2 = ref(true);
const isChecked = ref(false);

const changeIconPassword = () => {
  password.value = !password.value;
};

const changeIconConfirmPassword = () => {
  confirmPassword.value = !confirmPassword.value;
};
const changeIconPassword2 = () => {
  password2.value = !password2.value;
};

const changeIconConfirmPassword2 = () => {
  confirmPassword2.value = !confirmPassword2.value;
};

</script>