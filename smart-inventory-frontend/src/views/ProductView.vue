<template>
    <div class="container-fluid container-lg px-4 content page-order-list">
            <div class="my-2 mb-4 d-flex justify-content-between">
                <div>
                    <h3 class="m-0 fw-bold fs-4">ពត័មាននៃបន្ទប់</h3>
                </div>
                <div>
                <button type="button" class="btn btn-primary rounded-3">
                 របាយការណ៍ទាំងអស់
                </button>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                     <FilterProduct />
                </div>
                <div class="col-12">
                    <ListProduct />
                </div>
                <div class="col-12">
                <PaginationProduct />
                </div>
            </div>
        </div>
    </template>
    
    <script setup>
    // import {useOrderStore} from '@/stores/views/orderStore';
    import FilterProduct from '@/components/product/FilterProduct.vue';
    import ListProduct  from '@/components/product/ListProduct.vue';
    import PaginationProduct from "@/components/product/PaginationProduct.vue";
    </script>