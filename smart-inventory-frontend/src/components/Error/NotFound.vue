<template>
    
<div class="container-fluid container-lg page-not-found content">
    <div class="row">
           <div class="col-12">
                   <div class="card border-0 p-0 rounded-2">
                     <div class="card-body d-flex flex-column align-items-center py-5">
                          <div class="d-flex justify-content-center">
                            <img src="/error404.png" alt="" class="img-not-found">
                          </div>
                          <div class="d-flex flex-column gap-3 align-items-center">
                             <h1 class="fs-3 fw-semibold mb-0">ទំព័ររកមិនឃើញ</h1>
                             <p class="mb-0">យើងរកមិនឃើញទំព័រដែលអ្នកកំពុងស្វែងរក</p>
                             <button class="btn btn-primary" @click="router.push('/')">
                              សូមត្រឡប់ទៅទំព័រដើម
                              <i class="bi bi-arrow-right"></i>
                             </button>
                          </div>
                     </div>
                   </div>
           </div>
    </div>
</div>
</template>

<script setup>
       import { useRouter } from 'vue-router';
       const router = useRouter();
</script>