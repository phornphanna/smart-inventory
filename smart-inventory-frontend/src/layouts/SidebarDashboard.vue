<template>
    <div class="p-2 rounded-3 bg-white">
        <ul class="sidebar d-flex flex-column list-unstyled gap-3">
            <li class="sidebar-item">
                <router-link to="/" class="sidebar-link d-flex flex-column flex-lg-row"
                :class="{'active': route.name == 'home'}"
                >
                    <span>
                        <i class="bi bi-house-door"></i>
                    </span>
                    <span>
                       ទំព័រដើម
                    </span>
                </router-link>
            </li>
            <li class="sidebar-item">
                <router-link to="/profile" class="sidebar-link d-flex flex-column flex-lg-row"
                :class="{'active': route.name == 'profile'}"
                >
                    <span>
                        <i class="bi bi-person"></i>
                    </span>
                    <span>
                        ពត័មានផ្ទាល់ខ្លួន
                    </span>
                </router-link>
            </li>

            
              <li class="sidebar-item">
                <router-link to="/option" class="sidebar-link d-flex flex-column flex-lg-row"
                 :class="{'active': route.name == 'option'}"
                >
                    <span>
                       <i class="bi bi-three-dots"></i>
                    </span>
                    <span>
                        ជម្រើសបន្ថែម
                    </span>
                </router-link>
            </li>



               <li class="sidebar-item">
                <router-link to="/province" class="sidebar-link d-flex flex-column flex-lg-row"
                 :class="{'active': route.name == 'province'}"
                >
                    <span>
                        <i class="bi bi-geo-alt"></i>
                    </span>
                    <span>
                       ខេត្ត
                    </span>
                </router-link>
            </li>

              <li class="sidebar-item">
                <router-link to="/area" class="sidebar-link d-flex flex-column flex-lg-row"
                 :class="{'active': route.name == 'area'}"
                >
                    <span>
                        <i class="bi bi-map"></i>
                    </span>
                    <span>
                       តំបន់
                    </span>
                </router-link>
            </li>


            <li class="sidebar-item">
                <router-link to="/order" class="sidebar-link d-flex flex-column flex-lg-row"
                 :class="{'active': route.name == 'order'}"
                >
                    <span>
                        <i class="bi bi-cart"></i>
                    </span>
                    <span>
                        គ្រប់គ្រងការកម្មង់
                    </span>
                </router-link>
            </li>

            <li class="sidebar-item">
                <router-link to="/product" class="sidebar-link d-flex flex-column flex-lg-row"
                 :class="{'active': route.name == 'product'}"
                >
                    <span>
                        <i class="bi bi-box-seam"></i>
                    </span>
                    <span>
                        គ្រប់គ្រងបន្ទប់
                    </span>
                </router-link>
            </li>

             <li class="sidebar-item">
                <router-link to="/rent-report" class="sidebar-link d-flex flex-column flex-lg-row"
                 :class="{'active': route.name == 'rentReport'}"
                >
                    <span>
                        <i class="bi bi-bar-chart-line"></i>
                    </span>
                    <span>
                        របាយការណ៍ជួល
                    </span>
                </router-link>
            </li>

            <li class="sidebar-item">
                <router-link to="/booking-report" class="sidebar-link d-flex flex-column flex-lg-row"
                 :class="{'active': route.name == 'bookingReport'}"
                >
                    <span>
                        <i class="bi bi-bar-chart-line"></i>
                    </span>
                    <span>
                        របាយការណ៍កក់
                    </span>
                </router-link>
            </li>
           
           
            <li class="sidebar-item">
                <router-link to="/feedback" class="sidebar-link d-flex flex-column flex-lg-row"
                :class="{'active': route.name == 'feedback'}"
                >
                    <span>
                        <i class="bi bi-chat-dots"></i>
                    </span>
                    <span>
                        មើលមតិអតិថិជន
                    </span>
                </router-link>
            </li>

            <li class="sidebar-item">
                <span  class="sidebar-link d-flex flex-column flex-lg-row"
                @click="onOpenModalLogout"
                >
                    <span>
                        <i class="bi bi-box-arrow-left"></i>
                    </span>
                    <span>
                        ចាកចេញ
                    </span>
                </span>
            </li>
        </ul>
    </div>

<ModalLogout />

</template>

<script setup>
import { useAuthStore } from '@/stores/views/auth/authStore';
import ModalLogout from '@/components/auth/ModalLogout.vue';
import { useRoute } from 'vue-router';
const authStore = useAuthStore();
const route = useRoute();


const onOpenModalLogout = () =>{
    authStore.modalLogout.show();
}

</script>