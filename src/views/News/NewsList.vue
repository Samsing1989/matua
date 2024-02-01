<template>
    <section class="news">
        <div class="news__container">
            <h2 class="news__title title">{{ $t('title.newsTitle') }}</h2>
            <div class="news__cards">
                <div v-for="news in getNewsList" :key="news.id" class="news__card">
                    <news-comp :news="news" />
                </div>
            </div>
            <router-link v-if="getUser" to="/news-config" class="news__button button button-link">{{
                $t('button.onEdit')
            }}</router-link>
        </div>
    </section>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useNewsStore } from '@/store/modules/news'
import NewsComp from './NewsComp.vue'
import { useAuthStore } from '@/store/modules/auth'

export default {
    name: 'NewsList',
    components: {
        NewsComp,
    },
    computed: {
        ...mapState(useAuthStore, ['getUser']),
        ...mapState(useNewsStore, ['getNewsList']),
    },
    created() {
        return this.loadNewsList()
    },
    methods: {
        ...mapActions(useNewsStore, ['loadNewsList']),
    },
}
</script>

<style lang="scss" scoped></style>
