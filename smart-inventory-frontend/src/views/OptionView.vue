<template>
    <div class="container-fluid container-lg px-4 content page-order-list">
            <div class="my-2 mb-4 d-flex justify-content-between">
                <div>
                    <h3 class="m-0 fw-bold fs-4">ពត័មានជម្រើសបន្ថែម</h3>
                </div>
                <div>
                <button type="button" class="btn btn-primary rounded-3"
                @click="onOpenModalAdd"
                >
                 <i class="bi bi-plus-lg"></i> បង្កើតជម្រើសបន្ថែម
                </button>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <ListOption/>
                </div>
                <div class="col-12">
                <PaginationOption/>
                </div>
            </div>
        </div>

        <ModalAdd />
        <ModalUpdate />
        <ModalDelete />
    </template>
    
    <script setup>
    import ListOption from '@/components/option/ListOption.vue';
    import PaginationOption from '@/components/option/PaginationOption.vue';
    import { useOptionStore } from '@/stores/views/optionStore';
    import ModalAdd from '@/components/option/ModalAdd.vue';
    import ModalUpdate from '@/components/option/ModalUpdate.vue';
    import ModalDelete from '@/components/option/ModalDelete.vue'


    const optionStore = useOptionStore();

    const onOpenModalAdd = () =>{
       optionStore.modalInsert.show();
    }

    </script>