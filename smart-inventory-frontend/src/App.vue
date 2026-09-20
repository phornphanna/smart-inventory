<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useRoute } from 'vue-router';
import Header from '@/layouts/Header.vue';
import SidebarDashboard from '@/layouts/SidebarDashboard.vue';
const route = useRoute();
</script>

<template>
  <div class="container-fluid px-0  px-0 px-md-2">
    <div class="row  px-0 mx-0 g-3">
      <div class="col-12" v-if="route.meta.showLayout" >
        <Header />
      </div>
      <div class="d-none d-lg-block col-md-3 col-lg-3" v-if="route.meta.showLayout">
        <SidebarDashboard  />
      </div>
      <div
      :class="{
        'col-12 col-md-12 col-lg-9': route.meta.showLayout ,
        'col-12': !route.meta.showLayout
        }"
      >
        <RouterView />
      </div>
    </div>
  </div>
</template>
