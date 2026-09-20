import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/auth/LoginView.vue';
import SignupView from '@/views/auth/SignupView.vue';
import OtpView from '@/views/auth/OtpView.vue';
import ForgetPasswordView from '@/views/auth/ForgetPasswordView.vue';
import HomeView from '@/views/HomeView.vue';
import OrderView from '@/views/OrderView.vue';
import NotFound from '@/components/Error/NotFound.vue';
import Newpassword from '@/views/auth/NewpasswordView.vue';
import ProfileView from '@/views/ProfileView.vue';
import ProductView from '@/views/ProductView.vue';
import RentReportView from '@/views/RentReportView.vue';
import BookingReportView from '@/views/BookingReportView.vue';
import FeedbackView from '@/views/FeedbackView.vue';
import ProvinceView from '@/views/ProvinceView.vue';
import AreaView from '@/views/AreaView.vue';
import OptionView from '@/views/OptionView.vue';



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta:{
        title : "ចូលគណនី",
        showLayout : false,
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
      meta:{
        title : "បង្កើតគណនី",
        showLayout : false,
      }
    },
    {
      path: '/otp',
      name: 'otp',
      component: OtpView,
      meta:{
        title : "ផ្ទៀងផ្ទាត់លេខសម្ងាត់" ,
        showLayout :false,
      }
    },
    {
      path: '/forget-password',
      name: 'forgetPassword',
      component: ForgetPasswordView,
      meta:{
        title : "ភ្លេចពាក្យសម្ងាត់" ,
        showLayout : false,
      }
    },
    {
      path: '/new-password',
      name: 'newPassword',
      component: Newpassword,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta:{
        title : "ទំព័រដើម" ,
        showLayout : true,
      }
    },
    {
      path: '/profile',
      name : 'profile',
      component: ProfileView,
      meta:{
        title: "គណនីផ្ទាល់ខ្លួន" ,
        showLayout: true
      }
    },
    {
      path: '/province',
      name : 'province',
      component: ProvinceView,
      meta:{
        title: "ខេត្ត" ,
        showLayout: true
      }
    },
    {
      path: '/area',
      name : 'area',
      component: AreaView,
      meta:{
        title: "តំបន់" ,
        showLayout: true
      }
    },
    {
      path: '/option',
      name : 'option',
      component: OptionView,
      meta:{
        title: "ជម្រើសបន្ថែម" ,
        showLayout: true
      }
    },
    {
      path: '/order',
      name : 'order',
      component: OrderView,
      meta: {
         title: "ពត័មានការកម្មង់",
         showLayout: true
      }
    },
    {
      path: '/product',
      name : 'product',
      component: ProductView,
      meta: {
         title: "ពត័មានផលិតផល",
         showLayout: true
      }
    },
    {
      path: '/rent-report',
      name : 'rentReport',
      component: RentReportView,
      meta: {
         title: "ពត័មានការជួល",
         showLayout: true
      }

    },
    {
      path: '/booking-report',
      name : 'bookingReport',
      component: BookingReportView,
      meta: {
        title: "ពត័មានការកក់",
         showLayout: true
      }

    },
    {
      path: '/feedback',
      name : 'feedback',
      component: FeedbackView,
      meta: {
        title: "មតិអតិថិជន",
         showLayout: true
      }

    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFound,
      meta:{
        title : "រកមិនឃើញ" ,
        showLayout : true,
      }
    }

  ]
})

router.afterEach((to) => {
  document.title = to.meta.title || 'ទំព័រដើម';
});

export default router;
