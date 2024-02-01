import { defineStore } from 'pinia'
import DbOperations from '../helpers/DbOperations'
const collectionDB = new DbOperations('news')
import { useGeneralStore } from './general'

export const useNewsStore = defineStore('news', {
    state: () => {
        return {
            newsList: null,
        }
    },

    getters: {
        getNewsList: (state) => state.newsList,
        getNewsById: (state) => (id) => state.newsList.find((product) => product.id == id),
    },

    actions: {
        async loadNewsList() {
            const { generalApiOperation } = useGeneralStore()
            this.newsList = await generalApiOperation({
                operation: () => collectionDB.loadItemsList(),
            })
        },

        async addItemToNewsList(item) {
            const { generalApiOperation } = useGeneralStore()
            await generalApiOperation({
                operation: () => collectionDB.addItem(item),
            })
        },

        async deleteItemFromNewsList(id) {
            const { generalApiOperation } = useGeneralStore()
            this.newsList = await generalApiOperation({
                operation: () => collectionDB.deleteItem(id),
            })
            this.loadNewsList()
        },

        async updateItemInNewsList(itemId, item) {
            const { generalApiOperation } = useGeneralStore()
            await generalApiOperation({ operation: () => collectionDB.updateItem(itemId, item) })
        },
    },
})
