<template>
    <section class="mouthly">
        <div class="mouthly__container">
            <h2 class="mouthly__title title">{{ $t('title.watchesTitle') }}</h2>
            <div class="mouthly__filter"><product-filtered /></div>
            <div class="mouthly__cards">
                <div v-for="product in getFilterProductsList" :key="product.id" class="mouthly__card">
                    <product-item :product="product" />
                </div>
            </div>
            <router-link
                v-if="getCurrentUserPermissions.isAdmin"
                to="/config"
                class="mouthly__button button button-link"
                >{{ $t('button.onEdit') }}</router-link
            >
        </div>
    </section>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useAuthStore } from '@/store/modules/auth'
import { useUsersStore } from '@/store/modules/users'
import { useProductsStore } from '@/store/modules/products'
import ProductItem from '@/views/Product/ProductItem.vue'
import ProductFiltered from '@/views/Product/ProductFiltered.vue'
export default {
    name: 'ProductList',
    components: {
        ProductItem,
        ProductFiltered,
    },
    computed: {
        ...mapState(useUsersStore, ['getCurrentUserPermissions']),
        ...mapState(useAuthStore, ['getUser']),
        ...mapState(useProductsStore, ['getProductsList', 'getFilterProductsList']),
    },
    created() {
        this.loadProductsList()
    },
    methods: {
        ...mapActions(useProductsStore, ['loadProductsList']),
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style';
</style>
