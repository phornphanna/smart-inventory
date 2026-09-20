<template>

    <div>
        <div class="table-responsive">
            <table class="table table-bordered rounded-3 table-list-order">
                <thead>
                    <tr>
                        <th scope="col">លេខកូដតំបន់</th>
                        <th scope="col">ឈ្មោះតំបន់</th>
                        <th scope="col">ចំនួនបន្ទប់ជួល</th>
                        <th scope="col">មុខងារ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in 10">
                        <td class="d-flex align-items-center gap-2">A002</td>
                        <td>John</td>
                        <td>Doe</td>
                        <td>@social</td>
                     
                        <td class="d-flex gap-3 align-items-center">
                            <div class="download-recipt-icon bg-success-subtle"
                            @click="onOpenModalEdit()"
                            title="កែប្រែ"
                            >
                               <i class="bi bi-pencil-square text-success"></i>
                            </div>
                            <div class="view-detail-icon bg-danger-subtle"
                            title="លុប" @click="onOpenModalDelete()">
                              <i class="bi bi-trash text-danger"></i>
                            </div>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>
    </div>

</template>

<script setup>

import { useAreaStore } from '@/stores/views/areaStore';
const areaStore = useAreaStore();

const onOpenModalDelete = () =>{
  areaStore.modalDelete.show();
}

const onOpenModalEdit = () =>{
    areaStore.modalUpdate.show();
}


</script>
