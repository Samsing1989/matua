import { defineStore } from 'pinia'
import DbOperations from '../helpers/DbOperations'
const collectionDB = new DbOperations('swiper')
import { useGeneralStore } from './general'

export const useSwiperStore = defineStore('swiper', {
    state: () => {
        return {
            swiperList: null,
        }
    },

    getters: {
        getSwiperList: (state) => state.swiperList,
        getSwiperById: (state) => (id) => state.swiperList.find((product) => product.id == id),
    },

    actions: {
        async loadSwiperList() {
            const { generalApiOperation } = useGeneralStore()
            this.swiperList = await generalApiOperation({
                operation: () => collectionDB.loadItemsList(),
            })
        },

        async addItemToSwiperList(item) {
            const { generalApiOperation } = useGeneralStore()
            await generalApiOperation({
                operation: () => collectionDB.addItem(item),
            })
        },

        async deleteItemFromSwiperList(id) {
            const { generalApiOperation } = useGeneralStore()
            this.swiperList = await generalApiOperation({
                operation: () => collectionDB.deleteItem(id),
            })
            this.loadSwiperList()
        },

        async updateItemInSwiperList(itemId, item) {
            const { generalApiOperation } = useGeneralStore()
            await generalApiOperation({ operation: () => collectionDB.updateItem(itemId, item) })
        },
    },
})
