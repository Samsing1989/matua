<template>
    <main-master-page>
        <div class="product__container">
            <label class="product__lable">
                {{ $t('label.imgLable') }}
                <input v-model="swiperData.imgSrc" type="text" class="product__input" />
            </label>

            <div class="product__active">
                <button class="product__button button" @click="onAction">{{ buttonTitle }}</button>
                <button class="product__button button" @click="onCancel">{{ $t('button.deleteButton') }}</button>
            </div>
        </div>
    </main-master-page>
</template>

<script>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import { mapState, mapActions } from 'pinia'
import { useSwiperStore } from '@/store/modules/swiper'

export default {
    name: 'SwiperEdit',
    components: {
        MainMasterPage,
    },
    data() {
        return {
            swiperData: {},
        }
    },
    computed: {
        ...mapState(useSwiperStore, ['getSwiperById']),
        params() {
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
        if (this.params) this.swiperData = { ...this.getSwiperById(this.$route.params.id) }
    },
    methods: {
        ...mapActions(useSwiperStore, ['addItemToSwiperList', 'updateItemInSwiperList']),

        onAction() {
            if (!this.params) this.addItemToSwiperList(this.swiperData)
            else this.updateItemInSwiperList(this.swiperData.id, this.swiperData)
            this.$router.push({ name: 'home' })
        },

        onCancel() {
            this.$router.push({ name: 'home' })
        },
    },
}
</script>

<style lang="scss" scoped></style>
