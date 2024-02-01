<template>
    <main-master-page>
        <div class="news-edit__container">
            <label class="news-edit__lable">
                {{ $t('label.imgLable') }}
                <input v-model="newsData.imgSrc" type="text" class="news-edit__input" />
            </label>
            <label class="news-edit__lable">
                {{ $t('label.nameLable') }}
                <input v-model="newsData.name" type="text" class="news-edit__input" />
            </label>
            <label class="news-edit__lable">
                {{ $t('label.textPriceLable') }}
                <input v-model="newsData.text" type="text" class="news-edit__input" />
            </label>
            <div class="news-edit__active">
                <button class="news-edit__button button" @click="onAction">{{ buttonTitle }}</button>
                <button class="news-edit__button button" @click="onCancel">{{ $t('label.deleteButton') }}</button>
            </div>
        </div>
    </main-master-page>
</template>

<script>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import { mapState, mapActions } from 'pinia'
import { useNewsStore } from '@/store/modules/news'
import { useAuthStore } from '@/store/modules/auth'
export default {
    name: 'NewsEdit',
    components: {
        MainMasterPage,
    },
    data() {
        return {
            newsData: {},
        }
    },
    computed: {
        ...mapState(useNewsStore, ['getNewsById']),
        ...mapState(useAuthStore, ['getUser']),
        IsParams() {
            return this.$route.params.id
        },
        buttonTitle() {
            if (this.params && this.$i18n.locale === 'en') return 'Save'
            else if (this.params && this.$i18n.locale === 'ua') return 'Зберегти'
            else if (!this.params && this.$i18n.locale === 'en') return 'Create'
            else return 'Створити'
        },
    },
    created() {
        if (this.IsParams) this.newsData = { ...this.getNewsById(this.$route.params.id) }
    },
    methods: {
        ...mapActions(useNewsStore, ['addItemToNewsList', 'updateItemInNewsList']),

        onAction() {
            if (!this.IsParams) this.addItemToNewsList(this.newsData)
            else this.updateItemInNewsList(this.newsData.id, this.newsData)
            this.$router.push({ name: 'news' })
        },

        onCancel() {
            this.$router.push({ name: 'news' })
        },
    },
}
</script>

<style lang="scss" scoped></style>
