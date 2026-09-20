<template>
    <div class="container-fluid container-lg px-4 content page-order-list">
            <div class="my-2 mb-4 d-flex justify-content-between">
                <div>
                    <h3 class="m-0 fw-bold fs-4"> ពត័មាននៃខេត្ត</h3>
                </div>
                <div>
                <button type="button" class="btn btn-primary rounded-3"
                @click="onOpenModalAdd"
                >
                <i class="bi bi-plus-lg"></i> បង្កើតខេត្ត
                </button>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <ListProvince />
                </div>
                <div class="col-12">
                <PaginationProvince />
                </div>
            </div>
        </div>

        <ModalAdd />
        <ModalUpdate />
        <ModalDelete />

    </template>
    
    <script setup>
    import ListProvince from '@/components/province/ListProvince.vue';
    import PaginationProvince from '@/components/province/PaginationProvince.vue';
    import ModalAdd from '@/components/province/ModalAdd.vue';
    import ModalUpdate from '@/components/province/ModalUpdate.vue';
    import ModalDelete from '@/components/province/ModalDelete.vue';
    import { useProvinceStore } from '@/stores/views/provinceStore';
    const provinceStore = useProvinceStore();


    const onOpenModalAdd = () =>{
         provinceStore.modalInsert.show();
    }

    </script>