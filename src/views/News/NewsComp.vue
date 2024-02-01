<template>
    <div class="news__image">
        <img :src="news.imgSrc" alt="image" />
    </div>
    <div class="news__body">
        <div class="news__column">
            <div class="news__name">{{ news.name }}</div>
            <div class="news__text">{{ news.text }}</div>
        </div>
        <div class="news__actions">
            <button v-if="getUser" class="news__button button" @click="onEdit">{{ $t('button.update') }}</button>
            <button v-if="getUser" class="news__button button" @click="onDeleteProducts">
                {{ $t('button.deleteButton') }}
            </button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { useNewsStore } from '@/store/modules/news'
import { useAuthStore } from '@/store/modules/auth'

export default {
    name: 'NewsComp',
    props: {
        news: {
            type: Object,
            required: true,
        },
    },

    methods: {
        computed: {
            ...mapState(useAuthStore, ['getUser']),
        },
        ...mapActions(useNewsStore, ['deleteItemFromNewsList', 'updateItemInNewsList']),
        onEdit() {
            this.$router.push({
                name: 'news-config',
                params: {
                    id: this.news.id,
                },
            })
        },
        async onDeleteProducts() {
            await this.deleteItemFromNewsList(this.news.id)
        },
    },
}
</script>

<style lang="scss" scoped></style>
