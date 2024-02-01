import { defineStore } from 'pinia'
import DbOperations from '../helpers/DbOperations'
const collectionDB = new DbOperations('users')
import { useGeneralStore } from './general'

export const useUsersStore = defineStore('users', {
    state: () => {
        return {
            usersList: null,
            currentUser: null,
        }
    },

    getters: {
        getUsersList: (state) => state.usersList,
        getCurrentUser: (state) => state.currentUser,
        getCurrentUserPermissions: (state) => state.currentUser?.permissions ?? {},
        getUserByEmail: (state) => (email) => state.usersList?.find((user) => user.email === email),
    },

    actions: {
        async loadUsersList() {
            const { generalApiOperation } = useGeneralStore()
            this.usersList = await generalApiOperation({
                operation: () => collectionDB.loadItemsList(),
            })
        },

        async loadUserById(userId) {
            const { generalApiOperation } = useGeneralStore()
            if (userId) {
                this.currentUser = await generalApiOperation({
                    operation: () => collectionDB.getItemById(userId),
                })
                return this.currentUser
            }
        },

        async addUser(userData) {
            const { generalApiOperation } = useGeneralStore()
            this.currentUser = await generalApiOperation({
                operation: () => collectionDB.addItem(userData),
            })
        },

        async addUserWithCustomId({ id, data }) {
            const { generalApiOperation } = useGeneralStore()
            const userObj = await this.loadUserById(id)
            if (!userObj?.email) {
                this.currentUser = await generalApiOperation({
                    operation: () => collectionDB.addItemWithCustomId(id, data),
                })
            }
        },

        async updateUser({ id, data }) {
            const { generalApiOperation } = useGeneralStore()
            await generalApiOperation({
                operation: () => collectionDB.updateItem(id, data),
            })
            if (this.currentUser.email === data.email) {
                this.currentUser = data
            }
        },

        async deleteUser(userData) {
            const { generalApiOperation } = useGeneralStore()
            this.currentUser = await generalApiOperation({
                operation: () => collectionDB.deleteItem(userData),
            })
        },
    },
})
