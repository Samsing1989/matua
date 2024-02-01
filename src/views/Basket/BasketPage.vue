<template>
    <main-master-page>
        <template v-if="basketList?.length">
            <div>
                <basket-item v-for="item in basketList" :key="item.id" :basket="item" @delete="onDelete" />
            </div>
            <div>Total Sum {{ totalPrice }}</div>
            <button type="button" class="basket__button button" @click="onBack">Checkout</button>
        </template>
    </main-master-page>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import { useAuthStore } from '@/store/modules/auth'
import { useBasketStore } from '@/store/modules/basket'
import { useProductsStore } from '@/store/modules/products'
import BasketItem from '@/views/Basket/BasketItem.vue'
export default {
    name: 'BasketPage',
    components: {
        MainMasterPage,
        BasketItem,
    },
    data() {
        return {
            basketList: null,
        }
    },
    computed: {
        ...mapState(useAuthStore, ['getUser']),
        ...mapState(useBasketStore, ['getCurrentBasket']),
        ...mapState(useProductsStore, ['getProductById']),
        totalPrice() {
            return this.basketList?.reduce((prev, el) => prev + el.price, 0)
        },
    },
    mounted() {
        this.loadData()
    },

    methods: {
        ...mapActions(useBasketStore, [
            'getItemByIdFromList',
            'deleteItemFromCurrentBasket',
            'deleteItemFromBasketList',
        ]),
        ...mapActions(useProductsStore, ['loadProductsList']),

        async loadData() {
            this.basketList = await this.getCurrentBasket?.basket
        },
        async onDelete(data) {
            await this.deleteItemFromCurrentBasket(this.getUser.uid, 'basket', data)
            await this.getItemByIdFromList(this.getUser.uid)
            this.basketList = this.basketList.filter((item) => item.id !== data.id)
            const basket = await this.getCurrentBasket.basket
            localStorage.setItem('basket', JSON.stringify(basket))
        },
        //   async onOrderBtnClick() {
        //       const order = this.getCurrentBasket
        //       await this.addOrderToOrdersList(this.getUser.uid, 'basket', order)
        //       await this.deleteItemFromBasketList(this.getUser?.uid)
        //       this.cartList = null
        //       alert('Your order is complete!')
        //   },
    },
}
</script>

<style lang="scss" scoped></style>
