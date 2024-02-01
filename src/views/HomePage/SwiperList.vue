<template>
    <section class="hero">
        <div class="hero__container">
            <swiper
                class="hero__swiper"
                :modules="modules"
                :slides-per-view="1"
                :space-between="50"
                :speed="1200"
                :pagination="{ clickable: true }"
                :navigation="{ prevEl: '.swiper-button-next', nextEl: '.swiper-button-prev' }"
                @slideChange="onSlideChange"
                @swiper="onSwiper"
            >
                <swiper-slide v-for="swiper in getSwiperList" :key="swiper.id">
                    <swiper-comp :swiper="swiper" />
                </swiper-slide>
            </swiper>
            <div class="hero__body">
                <h2 class="hero__title title title_big">{{ $t('title.swiperTitle') }}</h2>
                <div class="hero__text">
                    <p>
                        {{ $t('text.swiperText') }}
                    </p>
                </div>
                <div class="hero__active">
                    <router-link to="/watches" class="hero__button button">
                        <span><font-awesome-icon :icon="['fas', 'cart-plus']" /></span
                        >{{ $t('button.swiperButton') }}</router-link
                    >
                </div>
            </div>
            <div class="hero__swiper-active">
                <router-link v-if="getCurrentUserPermissions.isAdmin" to="/swiper-config" class="hero__button button">{{
                    $t('button.onEdit')
                }}</router-link>
                <button class="hero__swiper-button swiper-button-next">
                    <font-awesome-icon :icon="['fas', 'angle-left']" />
                </button>
                <button class="hero__swiper-button swiper-button-prev">
                    <font-awesome-icon :icon="['fas', 'angle-right']" />
                </button>
            </div>
        </div>
    </section>
</template>

<script>
// import Swiper core and required modules
import { Navigation, Pagination } from 'swiper'

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'
import SwiperComp from '@/views/HomePage/SwiperComp.vue'
import { mapState, mapActions } from 'pinia'
import { useAuthStore } from '@/store/modules/auth'
import { useSwiperStore } from '@/store/modules/swiper'
import { useUsersStore } from '@/store/modules/users'

export default {
    name: 'SwiperList',
    components: {
        SwiperComp,
        Swiper,
        SwiperSlide,
    },

    setup() {
        const onSwiper = (swiper) => {
            console.log(swiper)
        }
        const onSlideChange = () => {
            console.log('slide change')
        }
        return {
            onSlideChange,
            onSwiper,
            modules: [Navigation, Pagination],
        }
    },

    computed: {
        ...mapState(useUsersStore, ['getCurrentUserPermissions']),
        ...mapState(useSwiperStore, ['getSwiperList']),
        ...mapState(useAuthStore, ['getUser']),
    },
    created() {
        return this.loadSwiperList()
    },
    methods: {
        ...mapActions(useSwiperStore, ['loadSwiperList']),
    },
}
</script>

<style lang="scss">
@import '@/assets/style';
</style>
