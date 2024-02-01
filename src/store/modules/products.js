import { defineStore } from 'pinia'
import DbOperations from '../helpers/DbOperations'
const collectionDB = new DbOperations('products')
import { useGeneralStore } from './general'
import { isMatchFilter } from '@/store/helpers/helper'

export const useProductsStore = defineStore('products', {
    state: () => {
        return {
            productsList: [],
            filter: {},
        }
    },

    getters: {
        getProductsList: (state) => state.productsList,
        getProductById: (state) => (id) => state.productsList.find((item) => item.id == id),
        getFilterProductsList: (state) => state.productsList.filter((product) => isMatchFilter(product, state.filter)),
    },

    actions: {
        async loadProductsList() {
            const { generalApiOperation } = useGeneralStore()
            this.productsList = await generalApiOperation({
                operation: () => collectionDB.loadItemsList(),
            })
        },

        async addItemToProductsList(item) {
            const { generalApiOperation } = useGeneralStore()
            await generalApiOperation({
                operation: () => collectionDB.addItem(item),
            })
        },

        async deleteItemFromProductsList(id) {
            const { generalApiOperation } = useGeneralStore()
            this.productsList = await generalApiOperation({
                operation: () => collectionDB.deleteItem(id),
            })
            this.loadProductsList()
        },

        async updateItemInProductsList(itemId, item) {
            const { generalApiOperation } = useGeneralStore()
            await generalApiOperation({ operation: () => collectionDB.updateItem(itemId, item) })
        },

        async loadFilteredProductsList(fieldTitle, compareOperator, valueToCompare) {
            const { generalApiOperation } = useGeneralStore()
            if (valueToCompare === 0)
                this.productsList = await generalApiOperation({
                    operation: () => collectionDB.loadItemsList(),
                })
            else
                this.productsList = await generalApiOperation({
                    operation: () => collectionDB.loadFilteredData(fieldTitle, compareOperator, valueToCompare),
                })
        },

        setFilterValue(filter) {
            this.filter = filter
        },
    },
})
