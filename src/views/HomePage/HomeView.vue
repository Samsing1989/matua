<template>
    <main-master-page>
        <swiper-list />
        <gallery-section />
    </main-master-page>
</template>

<script>
import SwiperList from '@/views/HomePage/SwiperList.vue'
import GallerySection from '@/views/HomePage/GallerySection.vue'
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
export default {
    name: 'HomeView',
    components: {
        MainMasterPage,
        GallerySection,
        SwiperList,
    },
}
</script>
