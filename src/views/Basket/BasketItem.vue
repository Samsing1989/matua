<template>
    <section class="basket">
        <div class="basket__container">
            <div class="basket__body">
                <div class="basket__items">
                    <div class="basket__image">
                        <img :src="productData.imgSrc" alt="image" />
                    </div>
                    <div class="basket__item">
                        <div class="basket__name">{{ productData.name }}</div>

                        <div class="basket__price">
                            $ <span>{{ productData.price }}</span>
                        </div>
                    </div>
                </div>
                <div class="basket__total-price">
                    <div class="basket__numbers">
                        <div class="basket__numb">
                            <span class="basket__span">-</span>
                            <div class="basket__sum">{{ productData.count }}</div>
                            <span class="basket__span">+</span>
                            <div class="basket__price">$ <span></span></div>
                        </div>
                        <button class="basket__bask">
                            <font-awesome-icon :icon="['fas', 'trash-can']" @click="onDelete" />
                        </button>
                    </div>
                </div>
            </div>
            <div></div>
        </div>
    </section>
</template>

<script>
import { mapState } from 'pinia'
import { useProductsStore } from '@/store/modules/products'
export default {
    name: 'BasketItem',
    props: {
        basket: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ['delete'],

    data() {
        return {
            productData: {},
        }
    },

    computed: {
        ...mapState(useProductsStore, ['getProductById']),
    },
    created() {
        this.productData = this.getProductById(this.basket.id)
    },
    methods: {
        onBack() {
            this.$router.push({
                name: 'home',
            })
        },
        onDelete() {
            this.$emit('delete', this.data)
        },
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style';
</style>
