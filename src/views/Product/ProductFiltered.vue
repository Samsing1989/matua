<template>
    <div class="product__filter">
        <div class="product__body-input">
            <label class="product__lable-filter">
                {{ $t('button.filterButton') }}
                <input v-model="filterList.name" type="text" class="product__input" />
            </label>

            <label class="product__lable-filter">
                {{ $t('button.fromButton') }}
                <input v-model="filterList.priceFrom" type="number" class="product__input" />
            </label>
            <label class="product__lable-filter">
                {{ $t('button.toButton') }}
                <input v-model="filterList.priceTo" type="number" class="product__input" />
            </label>
        </div>
        <button class="product__button button" @click="onCleanFilter">{{ $t('button.filterClearButton') }}</button>
    </div>
</template>

<script>
import { mapActions } from 'pinia'
import { useProductsStore } from '@/store/modules/products'
export default {
    name: 'ProductFiltered',
    data() {
        return {
            filterList: {
                priceFrom: null,
                priceTo: null,
                name: null,
            },
        }
    },
    watch: {
        filterList: {
            handler(newValue) {
                this.setFilterValue(newValue)
            },
            deep: true,
        },
    },
    methods: {
        ...mapActions(useProductsStore, ['setFilterValue', 'loadSortedProductsList']),

        onCleanFilter() {
            this.filterList = {}
        },
    },
}
</script>

<style lang="scss" scoped></style>
