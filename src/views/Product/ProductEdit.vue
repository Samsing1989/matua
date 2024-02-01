<template>
    <main-master-page>
        <div class="product__container">
            <label class="product__lable">
                {{ $t('label.imgLable') }}
                <input v-model="cardsData.imgSrc" type="text" class="product__input" />
            </label>
            <label class="product__lable">
                {{ $t('label.nameLable') }}
                <input v-model="cardsData.name" type="text" class="product__input" />
            </label>
            <label class="product__lable">
                {{ $t('label.savingLable') }}
                <input v-model="cardsData.discount" type="number" class="product__input" />
            </label>
            <label class="product__lable">
                {{ $t('label.oldPriceLable') }}
                <input v-model="cardsData.oldPrice" type="number" class="product__input" />
            </label>
            <label class="product__lable">
                {{ $t('label.newPriceLable') }}
                <input v-model="cardsData.price" type="number" class="product__input" />
            </label>
            <label class="product__lable">
                {{ $t('label.toButton') }}
                <input v-model="cardsData.text" type="text" class="product__input" />
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
import { useProductsStore } from '@/store/modules/products'

export default {
    name: 'ProductEdit',
    components: {
        MainMasterPage,
    },
    data() {
        return {
            cardsData: {},
        }
    },
    computed: {
        ...mapState(useProductsStore, ['getProductById']),

        params() {
            return this.$route.params.id
        },
        getLocale() {
            return this.$i18n.locale
        },
        buttonTitle() {
            if (this.params && this.$i18n.locale === 'en') return 'Save'
            else if (this.params && this.$i18n.locale === 'ua') return 'Зберегти'
            else if (!this.params && this.$i18n.locale === 'en') return 'Create'
            else return 'Створити'
        },
    },
    created() {
        if (this.params) this.cardsData = { ...this.getProductById(this.$route.params.id) }
    },
    methods: {
        ...mapActions(useProductsStore, ['addItemToProductsList', 'updateItemInProductsList']),

        onAction() {
            if (!this.params) this.addItemToProductsList(this.cardsData)
            else this.updateItemInProductsList(this.cardsData.id, this.cardsData)
            this.$router.push({ name: 'watches' })
        },

        onCancel() {
            this.$router.push({ name: 'watches' })
        },
    },
}
</script>

<style lang="scss" scoped></style>
