<template>

    <section class="container d-flex vh-100 justify-content-center align-items-center">
      <div class="row">
        <div class="col-12  col-md-10 col-lg-6 mx-auto">
          <div class="card border-0 auth-form bg-transparent">
            <div class="card-body d-flex flex-column gap-3">
              <div class="header-auth d-flex flex-column gap-3 align-items-center">
                <div class="">
                  <img src="/logo.png" width="120" alt="">
                </div>
                <div class="d-flex flex-column gap-1 align-items-center">
                  <h1 class="fs-4 fw-semibold mb-0">ចុះឈ្មោះគណនី</h1>
                  <p class="mb-0 text-fprm">
                    តើអ្នកមានគណនីទេ? <span class="custom-link" @click="router.push('/login')">ចូលគណនី</span>
                  </p>
                </div>
              </div>
              <form action="" class="row g-4" @submit.prevent="signupData">
                <div class="col-12 col-sm-6">
                  <div class="input-field input-group">
                    <input type="text" id="username" class="form-control" placeholder="" />
                    <label for="username" class="form-label">ឈ្មោះអ្នកប្រើប្រាស់</label>
                    <span class="input-group-text bg-black fs-5"><i class="bi bi-person"></i></span>
                  </div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="input-field input-group">
                    <input type="text" id="email" class="form-control" placeholder="" />
                    <label for="email" class="form-label">អ៊ីម៉ែល</label>
                    <span class="input-group-text bg-black fs-5"><i class="bi bi-envelope"></i></span>
                  </div>
                </div>
  
                <div class="col-12 col-sm-6 col-md-12">
                  <div class="input-field input-group">
                    <input :type="password ? 'password' : 'text'" id="password" class="form-control" placeholder="" />
                    <label for="password" class="form-label">ពាក្យសម្ងាត់</label>
                    <span class="input-group-text bg-black fs-5" @click="changeIconPassword">
                      <i class="bi" :class="password ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </span>
                  </div>
                </div>
                <div class="col-12 col-sm-6 col-md-12">
                  <div class="input-field input-group">
                    <input :type="confirmPassword ? 'password' : 'text'" id="confirmPassword" class="form-control"
                      placeholder="" />
                    <label for="confirmPassword" class="form-label">ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់</label>
                    <span class="input-group-text bg-black fs-5" @click="changeIconConfirmPassword">
                      <i class="bi" :class="confirmPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </span>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input custom-checkbox" v-model="isChecked" />
                    <label for="terms" class="fs-7">
                      ខ្ញុំយល់ព្រមនឹង <router-link to="/policy-privacy"
                        class="custom-link">លក្ខខណ្ឌនិងគោលការណ៍</router-link>
                    </label>
                  </div>
                </div>
                
                <div class="col-12">
                  <button type="submit" class="btn btn-lg btn-primary w-100 fs-6" :disabled="!isChecked">
                    ចុះឈ្មោះគណនី
                  </button>
                </div>
              </form>
              <div class="d-flex flex-column gap-3">
                <button type="button"
                  class="btn btn-lg btn-light w-100 fs-6 text-form d-flex gap-2 justify-content-center align-items-center">
                  <div class="icon-google">
                    <img src="/google-icon.svg" alt="" />
                  </div>
                  ចុះឈ្មោះគណនី Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { useAuthStore } from '@/stores/views/auth/authStore';
  import { Modal } from 'bootstrap';
  import { useRouter } from 'vue-router';
  
  const signupStore = useSignupStore();
  const router = useRouter();
  const password = ref(true);
  const confirmPassword = ref(true);
  const isChecked = ref(false); 
  
  
  
  const changeIconPassword = () => {
    password.value = !password.value;
  };
  
  const changeIconConfirmPassword = () => {
    confirmPassword.value = !confirmPassword.value;
  };
  
  const signupData = () => {
    if (isChecked.value) {
      alert('Sign up successful!');
    }
  
  };
  </script>
  