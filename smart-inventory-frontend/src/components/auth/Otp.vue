<template>
  <section class="container d-flex vh-100 justify-content-center align-items-center">
    <div class="row">
      <div class="col-12 col-sm-10 col-md-8 col-lg-6  col-xl-4 mx-auto">
        <div class="card border-0 auth-form bg-transparent">
          <div class="card-body d-flex flex-column gap-4">
            <div class="header-auth d-flex flex-column gap-3 align-items-center">
              <div>
                <img src="/logo.png" width="120" alt="">
              </div>
              <div class="d-flex flex-column gap-1 align-items-center">
                <h1 class="fs-4 fw-semibold mb-0">លេខកូដ OTP បានផ្ញើមកកាន់</h1>
                <p class="mb-0  fw-semibold">
                  phornphanna3@gmail.com
                </p>
              </div>
            </div>

            <form class="row g-4" @submit.prevent="submitOtpData">
              <div class="col-12">
                <label for="otp" class="fs-6 mb-2">បញ្ចូលពាក្យសម្ងាត់</label>
                <div class="row g-3">
                  <div class="col-2  otp-box" v-for="item in otpStore.otpArray">
                    <input type="text" class="form-control text-center" v-model="otp" maxlength="1" />
                  </div>
                </div>
              </div>

              <div class="col-12">
                <div class="mb-3 d-flex flex-column gap-3 align-items-center">
                  <button type="submit" class="btn btn-lg btn-primary w-100 fs-6" :disabled="false">
                    ចុះឈ្មោះគណនី
                  </button>
                  <div class="d-flex align-items-center">
                    <span class="mt-1"><i class="bi bi-arrow-left  fw-semibold fs-5 me-1"></i> </span>
                    <router-link to="/login" class="text-black  fw-semibold text-decoration-none">ត្រឡប់ទៅកាន់ការចូលគណនី</router-link>
                  </div>
                </div>
                <div>
                  <p class="mb-0">តើអ្នកមិនទាន់ទទួលបានលេខសម្ងាត់ទេឬ? <span class="fw-semibold cursor-pointer">ផ្ញើម្ដងទៀត</span></p>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useOtpStore } from '@/stores/views/auth/otpStore';
import { useRouter } from "vue-router";
const router  = useRouter();
const otpStore = useOtpStore();



const submitOtpData  = () =>{
   router.push('/new-password');

}

</script>
