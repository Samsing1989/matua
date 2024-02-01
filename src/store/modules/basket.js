import { defineStore } from 'pinia'
import DbOperations from '../helpers/DbOperations'
const collectionDB = new DbOperations('baskets')
import { useGeneralStore } from './general'

export const useBasketStore = defineStore('baskets', {
    state: () => {
        return {
            basketList: null,
            currentBasket: null,
        }
    },

    getters: {
        getBasketList: (state) => state.basketList,
        getCurrentBasket: (state) => state.currentBasket,
        getBasketById: (state) => (id) => state.basketList.find((el) => el.id === id),
    },

    actions: {
        async loadBasketList() {
            const { generalApiOperation } = useGeneralStore()
            this.basketList = await generalApiOperation({
                operation: () => collectionDB.loadItemsList(),
            })
        },

        async addItemToBasketList(id, arrayProperty, value) {
            const { generalApiOperation } = useGeneralStore()
            await generalApiOperation({
                operation: () => collectionDB.addItemToArray(id, arrayProperty, value),
            })
        },

        async getItemByIdFromList(id) {
            const { generalApiOperation } = useGeneralStore()
            this.currentBasket = await generalApiOperation({
                operation: () => collectionDB.getItemById(id),
            })
        },

        async deleteItemFromCurrentBasket(id, arrayProperty, value) {
            const { generalApiOperation } = useGeneralStore()
            this.currentBasket = await generalApiOperation({
                operation: () => collectionDB.removeItemFromArray(id, arrayProperty, value),
            })
        },

        async deleteItemFromBasketList(id) {
            const { generalApiOperation } = useGeneralStore()
            this.basketList = await generalApiOperation({
                operation: () => collectionDB.deleteItem(id),
            })
        },
    },
})
