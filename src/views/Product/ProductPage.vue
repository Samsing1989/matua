<template>
    <main-master-page>
        <product-list />
    </main-master-page>
</template>

<script>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import ProductList from '@/views/Product/ProductList.vue'

export default {
    name: 'ProductPage',
    components: {
        MainMasterPage,
        ProductList,
    },
}
</script>

<style lang="scss" scoped></style>
