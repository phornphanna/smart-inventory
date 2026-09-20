<template>
    <div class="container">
        <div class="d-flex justify-content-center align-items-center vh-100">
            <div class="login col-12 col-lg-4 text-center px-3 px-lg-0">
                <div class="mx-auto text-center mb-3">
                    <img src="/logo.png" class=" object-fit-cover" width="120" alt="">
                </div>
                <div class="mb-5">
                    <h3 class=" fw-bold">ស្វាគមន៍សារជាថ្មី​</h3>
                </div>
                <form action="">
                    <div class="input-field input-group mb-4">
                      <input type="text" id="email" class="form-control" placeholder="" />
                      <label for="email" class="form-label">អ៊ីម៉ែល</label>
                      <span class="input-group-text bg-black fs-5"><i class="bi bi-envelope"></i></span>
                    </div>
                    <div class="input-field input-group mb-4">
                      <input :type="password ? 'password' : 'text'" id="password" class="form-control" placeholder="" />
                      <label for="password" class="form-label">ពាក្យសម្ងាត់</label>
                      <span class="input-group-text bg-black fs-5" @click="changeIconPassword">
                        <i class="bi" :class="password ? 'bi-eye-slash' : 'bi-eye'"></i>
                      </span>
                    </div>
                  
                    <div class=" d-flex justify-content-between mb-4">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">
                                ចងចាំគណនីខ្ញុំ
                            </label>
                        </div>
                        <a href="#" class=" custom-link ">ភ្លេចលេខសម្ងាត់មែនទេ?</a>
                    </div>
                    <div class="mb-4">
                        <button type="submit" class="btn w-100 py-2 btn-primary btn-block rounded-2 mb-4">ចូលប្រើប្រាស់</button>
                        <button type="submit" class="btn w-100 py-2 btn-light btn-block rounded-2">
                            <img src="/google-icon.svg" class="me-3" width="25px" alt=""><span>ចូលប្រើប្រាស់ជាមួយ Google</span>
                        </button>
                    </div>
                    <div>
                        <span class="text-label">មិនមានគណនីមែនទេ?</span><RouterLink to="/signup" class=" custom-link ">បង្កើតគណនី</RouterLink>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>

 import { ref } from 'vue';

const password = ref(true);
const confirmPassword = ref(true);
const isChecked = ref(false);

const changeIconPassword = () => {
  password.value = !password.value;
};

const changeIconConfirmPassword = () => {
  confirmPassword.value = !confirmPassword.value;
};

</script>