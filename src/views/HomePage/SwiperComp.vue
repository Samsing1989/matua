<template>
    <div class="hero__swipers">
        <div class="hero__image">
            <img :src="swiper.imgSrc" alt="image" />
        </div>
        <div v-if="getCurrentUserPermissions.isAdmin" class="hero__active-swip">
            <button class="hero__button button" @click="onEdit">{{ $t('button.update') }}</button>
            <button class="hero__button button" @click="onDeleteSwiper">{{ $t('button.deleteButton') }}</button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { useUsersStore } from '@/store/modules/users'
import { useSwiperStore } from '@/store/modules/swiper'
export default {
    name: 'SwiperComp',

    props: {
        swiper: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        ...mapState(useUsersStore, ['getCurrentUserPermissions']),
    },
    methods: {
        ...mapActions(useSwiperStore, ['updateItemInSwiperList', 'deleteItemFromSwiperList']),
        onEdit() {
            this.$router.push({
                name: 'swiper-config',
                params: {
                    id: this.swiper.id,
                },
            })
        },
        async onDeleteSwiper() {
            await this.deleteItemFromSwiperList(this.swiper.id)
        },
    },
}
</script>

<style lang="scss" scoped></style>
