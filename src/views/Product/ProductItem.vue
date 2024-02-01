<template>
    <div class="mouthly__image">
        <img :src="product.imgSrc" alt="image" />
    </div>
    <div class="mouthly__body">
        <div class="mouthly__column">
            <h3 class="mouthly__title-small">
                <a href="#" class="mouthly__link-title">{{ product.name }}</a>
            </h3>
            <div v-if="isDiscont" class="mouthly__discount-num">{{ product.discount }}% Off</div>
            <div v-if="isDiscont" class="mouthly__discount">${{ product.oldPrice }}</div>
            <div class="mouthly__text">{{ product.text }}</div>
            <div class="mouthly__price">$ {{ product.price }}</div>
        </div>
        <div class="mouthly__actions">
            <button
                v-if="getCurrentUserPermissions.isAdmin"
                class="mouthly__button button"
                type="button"
                @click="onEdit"
            >
                {{ $t('button.update') }}
            </button>
            <button
                v-if="getCurrentUserPermissions.isAdmin"
                class="mouthly__button button"
                type="button"
                @click="onDeleteProducts"
            >
                {{ $t('button.deleteButton') }}
            </button>
            <button v-if="getUser" class="mouthly__button button" type="button" @click="onAddToBasket">
                {{ $t('button.addToCart') }}
            </button>
        </div>
    </div>
</template>
<!-- v-if="getUser" -->
<script>
import { mapActions, mapState } from 'pinia'
import { useUsersStore } from '@/store/modules/users'
import { useAuthStore } from '@/store/modules/auth'
import { useProductsStore } from '@/store/modules/products'
import { useBasketStore } from '@/store/modules/basket'
export default {
    name: 'ProductItem',
    props: {
        product: {
            type: Object,
            required: true,
        },
    },
    computed: {
        ...mapState(useUsersStore, ['getCurrentUserPermissions']),
        ...mapState(useAuthStore, ['getUser']),
        ...mapState(useBasketStore, ['getCurrentBasket']),
        isDiscont() {
            if (this.product.oldPrice || this.product.discount) {
                return this.product.oldPrice - this.product.price - this.product.discount
            } else return null
        },
    },

    methods: {
        ...mapActions(useProductsStore, ['updateItemInProductsList', 'deleteItemFromProductsList']),
        ...mapActions(useBasketStore, ['addItemToBasketList', 'getItemByIdFromList']),

        onEdit() {
            this.$router.push({
                name: 'product-config',
                params: {
                    id: this.product.id,
                },
            })
        },
        async onDeleteProducts() {
            await this.deleteItemFromProductsList(this.product.id)
        },
        async onAddToBasket() {
            const product = {
                id: this.product.id,
                imgSrc: this.product.imgSrc,
                name: this.product.name,
                price: this.product.price,
            }
            await this.addItemToBasketList(this.getUser.uid, 'basket', product)
            await this.getItemByIdFromList(this.getUser.uid)
            // this.$router.push({
            //     name: 'basket',
            // })
        },
    },
}
</script>

<style lang="scss" scoped></style>
