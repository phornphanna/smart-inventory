<template>
<div class="container-fluid container-lg px-4 content page-order-list">
        <div class="my-2 mb-4 d-flex justify-content-between">
            <div>
                <h3 class="m-0 fw-bold fs-4">ពត័មាននៃការកម្មង់</h3>
            </div>
            <div>
            <button type="button" class="btn btn-primary rounded-3">
             ទាយយករបាយការណ៍
            </button>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                 <FilterOrder />
            </div>
            <div class="col-12">
                <ListOrder />
            </div>
            <div class="col-12">
            <PaginationOrder />
            </div>
        </div>
    </div>
</template>

<script setup>
// import {useOrderStore} from '@/stores/views/orderStore';
import ListOrder from '@/components/order/ListOrder.vue';
import FilterOrder  from '@/components/order/FilterOrder.vue';
import PaginationOrder from "@/components/order/PaginationOrder.vue";
</script>