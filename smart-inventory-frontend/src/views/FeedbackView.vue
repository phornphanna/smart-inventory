<template>
    <div class="container-fluid container-lg px-4 content page-feedback-list">
            <div class="my-2 mb-4 d-flex justify-content-between">
                <div>
                    <h3 class="m-0 fw-bold fs-4">ពត័មាននៃមតិអតិថិជន</h3>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                     <FilterFeedback />
                </div>
                <div class="col-12">
                    <ListFeedback />
                </div>
            </div>
        </div>
    </template>
    
    <script setup>
    // import {usefeedbackStore} from '@/stores/views/feedbackStore';
    import ListFeedback from '@/components/feedback/ListFeedback.vue';
    import FilterFeedback  from '@/components/feedback/FilterFeedback.vue';
    import PaginationFeedback from "@/components/feedback/PaginationFeedback.vue";
    </script>