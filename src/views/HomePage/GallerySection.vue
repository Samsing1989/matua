<template>
    <div class="gallery">
        <div class="gallery__container">
            <h2 class="gallery__title title">{{ $t('title.galerryTitle') }}</h2>
            <div class="gallery__column">
                <div v-for="gallery in getGalleryList" :key="gallery.id" class="gallery__items">
                    <a :href="gallery.imgSrc" target="_blank" class="gallery__item">
                        <div class="gallery__image">
                            <img :src="gallery.imgSrc" alt="Image" />
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useGalleryStore } from '@/store/modules/gallery'
export default {
    name: 'GallerySection',

    computed: {
        ...mapState(useGalleryStore, ['getGalleryList']),
    },
    created() {
        return this.loadGalleryList()
    },
    methods: {
        ...mapActions(useGalleryStore, ['loadGalleryList']),
    },
}
</script>

<style lang="scss" scoped></style>
