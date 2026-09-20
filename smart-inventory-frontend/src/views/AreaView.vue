<template>
    <div class="container-fluid container-lg px-4 content page-order-list">
            <div class="my-2 mb-4 d-flex justify-content-between">
                <div>
                    <h3 class="m-0 fw-bold fs-4"> ពត័មាននៃតំបន់</h3>
                </div>
                <div>
                <button type="button" class="btn btn-primary rounded-3"
                @click="onOpenModalAdd"
                >
                 <i class="bi bi-plus-lg"></i>  បង្កើតតំបន់
                </button>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <ListArea />
                </div>
                <div class="col-12">
                <PaginationArea />
                </div>
            </div>
        </div>
        <ModalUpdate />
        <ModalAdd />
        <ModalDelete />

    </template>
    
    <script setup>
    import { useAreaStore } from '@/stores/views/areaStore';
    import ListArea from '@/components/area/ListArea.vue';
    import PaginationArea from '@/components/area/PaginationArea.vue';
    import ModalAdd from '@/components/area/ModalAdd.vue';
    import ModalUpdate from '@/components/area/ModalUpdate.vue';
     import ModalDelete from '@/components/area/ModalDelete.vue';
 
    const areaStore = useAreaStore();
    
    const onOpenModalAdd = () =>{
        areaStore.modalInsert.show();
    }


    </script>