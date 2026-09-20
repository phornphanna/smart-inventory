<template>
    <section class="container d-flex vh-100 justify-content-center align-items-center">
      <div class="row w-100">
        <div class="col-12 col-md-10 col-lg-6  mx-auto">
          <div class="card border-0 auth-form bg-transparent">
            <div class="card-body d-flex flex-column gap-3">
              <div class="header-auth d-flex flex-column gap-3 align-items-center text-center">
                <div>
                  <img src="/logo.png" width="100" class="img-fluid" alt="Logo">
                </div>
                <div class="d-flex flex-column gap-1 align-items-center">
                  <h1 class="fs-5 fs-md-4 fw-semibold mb-0">
                    ភ្លេចលេខសម្ងាត់?
                  </h1>
                  <p class="mb-0 fs-6 text-muted">
                    បញ្ចូលអ៊ីមែលរបស់អ្នកដើម្បីទទួលបានតំណកំណត់លេខសម្ងាត់ឡើងវិញ
                  </p>
                </div>
              </div>
  
              <form class="row g-3" @submit.prevent="submitForgotPassword">
                <div class="col-12">
                    <div class="input-field input-group mb-3">
                  <input type="text" id="email" class="form-control" placeholder="" />
                  <label for="email" class="form-label">អ៊ីម៉ែល</label>
                  <span class="input-group-text bg-black fs-5"><i class="bi bi-envelope"></i></span>
                </div>
                </div>
                <div class="col-12 d-flex flex-column align-items-center">
                  <button type="submit" class="btn btn-lg btn-primary w-100 fs-6 mb-3" :disabled="false">
                    កំណត់ពាក្យសម្ងាត់ឡើងវិញ
                  </button>
                  <div class="d-flex align-items-center">
                    <span class="mt-1"><i class="bi bi-arrow-left  fw-semibold fs-5 me-1"></i> </span>
                    <router-link to="/login" class="text-black  fw-semibold text-decoration-none">ត្រឡប់ទៅកាន់ការចូលគណនី</router-link>
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
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  const router  = useRouter();
  const email = ref("");
  
  const submitForgotPassword = () => {
       router.push('/otp');
  };
  </script>
  
  <style scoped>
  /* Responsive styles */
  @media (max-width: 576px) {
    .card-body {
      padding: 1rem;
    }
    .btn-lg {
      padding: 0.5rem 1rem;
      font-size: 1rem;
    }
    .header-auth h1 {
      font-size: 1.25rem;
    }
    .header-auth p {
      font-size: 0.9rem;
    }
  }
  </style>