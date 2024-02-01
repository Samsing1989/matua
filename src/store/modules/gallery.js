import { defineStore } from 'pinia'
import DbOperations from '../helpers/DbOperations'
const collectionDB = new DbOperations('gallery')
import { useGeneralStore } from './general'

export const useGalleryStore = defineStore('gallery', {
    state: () => {
        return {
            galleryList: null,
        }
    },

    getters: {
        getGalleryList: (state) => state.galleryList,
        getGalleryrById: (state) => (id) => state.galleryList.find((product) => product.id == id),
    },

    actions: {
        async loadGalleryList() {
            const { generalApiOperation } = useGeneralStore()
            this.galleryList = await generalApiOperation({
                operation: () => collectionDB.loadItemsList(),
            })
        },

        async addItemToGalleryList(item) {
            const { generalApiOperation } = useGeneralStore()
            await generalApiOperation({
                operation: () => collectionDB.addItem(item),
            })
        },

        async deleteItemFromGalleryList(id) {
            const { generalApiOperation } = useGeneralStore()
            this.galleryList = await generalApiOperation({
                operation: () => collectionDB.deleteItem(id),
            })
            this.loadGalleryList()
        },

        async updateItemInGalleryList(itemId, item) {
            const { generalApiOperation } = useGeneralStore()
            await generalApiOperation({ operation: () => collectionDB.updateItem(itemId, item) })
        },
    },
})
