<template>
    <div class="container-fluid container-lg px-4 content page-order-list">
            <div class="my-2 mb-4 d-flex justify-content-between">
                <div>
                    <h3 class="m-0 fw-bold fs-4">ពត័មាននៃផលិតផល</h3>
                </div>
                <div>
                <button type="button" class="btn btn-primary rounded-3">
                 របាយការណ៍ទាំងអស់
                </button>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                     <FilterBooking />
                </div>
                <div class="col-12">
                    <ListBooking />
                </div>
                <div class="col-12">
                <PaginationBooking />
                </div>
            </div>
        </div>
    </template>
    
    <script setup>
    // import {useOrderStore} from '@/stores/views/orderStore';
    import FilterBooking from '@/components/booking-report/FilterBooking.vue';
    import ListBooking  from '@/components/booking-report/ListBooking.vue';
    import PaginationBooking from "@/components/booking-report/PaginationBooking.vue";
    </script>