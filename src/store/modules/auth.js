import { defineStore } from 'pinia'
import { useGeneralStore } from './general'
import { useUsersStore } from './users'
import authOperations from '../helpers/AuthOperations'

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
            user: null,
        }
    },

    getters: {
        getUser: (state) => state.user,
    },

    actions: {
        async signUpWithWithEmailAndPassword(email, password) {
            const { generalApiOperation } = useGeneralStore()
            const usersStore = useUsersStore()

            await generalApiOperation({
                operation: () => authOperations.signUpWithWithEmailAndPassword({ email, password }),
            }).then(async (res) => {
                this.user = res

                await usersStore.addUserWithCustomId({
                    id: this.user?.uid,
                    data: {
                        email,
                        permissions: {
                            create: false,
                            read: true,
                            update: false,
                            delete: false,
                        },
                    },
                })
            })
        },

        signInWithWithEmailAndPassword(email, password) {
            const { generalApiOperation } = useGeneralStore()
            const usersStore = useUsersStore()
            return new Promise((resolve, reject) => {
                generalApiOperation({
                    operation: () => authOperations.signInWithWithEmailAndPassword({ email, password }),
                })
                    .then((res) => {
                        this.user = res
                        usersStore
                            .loadUserById(this.user.uid)
                            .then(() => {
                                resolve(res)
                            })
                            .catch((error) => reject(error))
                    })
                    .catch((error) => reject(error))
            })
        },

        loginWithGoogleAccount() {
            const { generalApiOperation } = useGeneralStore()
            const usersStore = useUsersStore()
            return new Promise((resolve, reject) => {
                generalApiOperation({
                    operation: () => authOperations.loginWithGoogleAccountPopup(),
                })
                    .then((res) => {
                        this.user = res

                        usersStore
                            .addUserWithCustomId({
                                id: this.user?.uid,
                                data: {
                                    email: this.user?.email,
                                    permissions: {
                                        create: false,
                                        read: true,
                                        update: false,
                                        delete: true,
                                    },
                                },
                            })
                            .then(() => {
                                usersStore.loadUserById(this.user.uid).then(() => {
                                    resolve(res)
                                })
                            })
                    })
                    .catch((error) => reject(error))
            })
        },

        loginWithCredential() {
            const { generalApiOperation } = useGeneralStore()
            return new Promise((resolve, reject) => {
                generalApiOperation({
                    operation: () => authOperations.loginWithCredential(),
                })
                    .then((res) => {
                        this.user = res
                        resolve(res)
                    })
                    .catch((error) => reject(error))
            })
        },

        async logOut() {
            const { generalApiOperation } = useGeneralStore()
            const usersStore = useUsersStore()
            await generalApiOperation({
                operation: () => authOperations.logout(),
            })
            this.user = null
            usersStore.currentUser = null
        },

        getAuthData() {
            return this.user
        },
    },
})
