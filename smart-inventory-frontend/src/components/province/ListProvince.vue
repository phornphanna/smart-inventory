<template>

    <div>
        <div class="table-responsive">
            <table class="table table-bordered rounded-3 table-list-order">
                <thead>
                    <tr>
                        <th scope="col">លេខកូដខេត្ត</th>
                        <th scope="col">ឈ្មោះខេត្ត</th>
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
                            @click="onOpenModalDelete"
                            title="លុប"
                            >
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
import { useProvinceStore } from '@/stores/views/provinceStore';
const provinceStore = useProvinceStore();
const onOpenModalDelete = () =>{
   provinceStore.modalDelete.show();
}

const onOpenModalEdit = () =>{
   provinceStore.modalUpdate.show();
}


</script>
