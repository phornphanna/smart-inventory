<template>
    <div class=" w-100 vh-100 bg-white rounded rounded-4 p-3">
        <h4 class=" m-0 mb-3 fw-bold">គណនី</h4>
        <div class="card rounded rounded-3 profile-order mb-3">
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-3">
                        <div class="profile-img position-relative">
                            <img src="/no-img.png" class="object-fit-cover" width="100%" height="100%" alt="">
                            <div class="box-edit position-absolute">
                                       <span class="fs-8"
                                       @click="onHandleEditImage"
                                       ><i class="bi bi-pencil"></i></span>
                            </div>
                        </div>
                        <div>
                            <h5 class="m-0">Loun San</h5>
                            <p class="m-0 text-grey fs-7">Customer</p>
                            <p class="m-0 text-grey fs-7">Address: Phnom Penh</p>
                        </div>
                    </div>
                    <!-- <div>
                        <button type="button" class="btn btn-outline-primary rounded rounded-3">កែប្រែ <i class="bi bi-pencil-square ms-1"></i></button>
                    </div> -->
                </div>
            </div>
        </div>
        <div class="card rounded rounded-3 profile-order mb-3">
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <h5 class="m-0">ព័ត៌មានផ្ទាល់ខ្លួន</h5>
                    <button type="button" class
                    ="btn btn-outline-primary rounded rounded-3"
                    @click="onModalEditInfoOpen()"
                    >កែប្រែ<i class="bi bi-pencil-square ms-1"></i></button>
                </div>
                <div class="row mb-3">
                    <div class="col-4">
                        <p class="m-0 text-grey">នាមត្រកូល</p>
                        <p class="m-0">Loun</p>
                    </div>
                    <div class="col-4">
                        <p class="m-0 text-grey">នាមខ្លួន</p>
                        <p class="m-0">San</p>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-4">
                        <p class="m-0 text-grey">អុីម៉ែល</p>
                        <p class="m-0">sanloun@gmail.com</p>
                    </div>
                    <div class="col-4">
                        <p class="m-0 text-grey">អាសយដ្ឋាន</p>
                        <p class="m-0">Cambodia,Phnom Penh</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-4">
                        <p class="m-0 text-grey">លេខទូរស័ព្ទ</p>
                        <p class="m-0">011410141</p>
                    </div>
                    <div class="col-4">
                        <p class="m-0 text-grey">ថ្ងៃខែឆ្នាំកំណើត</p>
                        <p class="m-0">December 11, 2006</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="card rounded rounded-3 profile-order">
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                    <h5 class="m-0">ប្ដូរលេខសម្ងាត់</h5>
                    <button type="button" class="btn btn-outline-primary rounded rounded-3"
                    @click="onModalEditPasswordOpen"
                    >កែប្រែ<i class="bi bi-pencil-square ms-1"></i></button>
                </div>
            </div>
        </div>
    </div>

    <ModalEditInfo />
    <ModalEditPassword />

</template>

<script setup>
import { useProfileStore } from '@/stores/views/profileStore';
import ModalEditInfo  from '@/components/profile/ModalEditInfo.vue';
import ModalEditPassword from './ModalEditPassword.vue';
import { onMounted } from 'vue';
const profileStore = useProfileStore();

onMounted(()=>{
    
})

const onModalEditPasswordOpen  = () => {
      profileStore.modalEditPassword.show();
}

const onModalEditInfoOpen = () => {
 profileStore.modalEditInfo.show();
}

</script>