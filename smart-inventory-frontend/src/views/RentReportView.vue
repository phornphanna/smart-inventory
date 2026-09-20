<template>
    <div class="container-fluid container-lg px-4 content page-order-list">
            <div class="my-2 mb-4 d-flex justify-content-between">
                <div>
                    <h3 class="m-0 fw-bold fs-4">របាយការណ៍ជួល</h3>
                </div>
                <div>
                <button type="button" class="btn btn-primary rounded-3">
                 របាយការណ៍ទាំងអស់
                </button>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                     <FilterRent />
                </div>
                <div class="col-12">
                    <ListRent />
                </div>
                <div class="col-12">
                <PaginationRent />
                </div>
            </div>
        </div>
    </template>
    
    <script setup>
    // import {useOrderStore} from '@/stores/views/orderStore';
    import FilterRent from '@/components/rent-report/FilterRent.vue';
    import ListRent  from '@/components/rent-report/ListRent.vue';
    import PaginationRent from "@/components/rent-report/PaginationRent.vue";
    </script>