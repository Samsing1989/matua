import { auth } from '@/firebase-config.js'
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithCredential,
} from 'firebase/auth'

class GoogleAuthOperations {
    constructor({ saveCredentialsInLocalStorage = true, authCredentialLocalStorageKey = 'authCredential' } = {}) {
        this.saveCredentialsInLocalStorage = saveCredentialsInLocalStorage
        this.authCredentialLocalStorageKey = authCredentialLocalStorageKey
    }

    async saveLoginUserData(loginResult) {
        // async saveLoginUserData({ commit }, loginResult) {
        // console.log('loginResult')
        // console.log(loginResult)
        //--------- user data -------
        // const user = loginResult?.user // об'єкт користувача
        // commit('setUser', user)
        //user.displayName - ім'я акаунту
        //user.photoURL - аватар акаунту
        //user.email - електронна адреса акаунту

        //--------- user access token -------
        // This gives you a Google Access Token. You can use it to access the Google API.
        let credential = GoogleAuthProvider.credentialFromResult(loginResult)

        localStorage.setItem(this.authCredentialLocalStorageKey, JSON.stringify(credential))

        // dispatch('users/loadUserPermissions', user.uid, { root: true })
    }

    // логинизация через google-аккаунт
    loginWithGoogleAccountPopup() {
        return new Promise((resolve, reject) => {
            const provider = new GoogleAuthProvider()
            signInWithPopup(auth, provider)
                .then((loginResult) => {
                    if (this.saveCredentialsInLocalStorage) this.saveLoginUserData(loginResult)
                    resolve(loginResult?.user)
                })
                .catch((error) => {
                    console.log(error.message)
                    reject(error)
                    // const errorCode = error.code;
                    // const errorMessage = error.message;
                })
        })
    }

    // логинизация нового юзера через email and password
    signUpWithWithEmailAndPassword({ email, password }) {
        return new Promise((resolve, reject) => {
            if (!email || !password) reject(false)
            else {
                const auth = getAuth()
                createUserWithEmailAndPassword(auth, email, password)
                    .then((loginResult) => {
                        // if (this.saveCredentialsInLocalStorage) this.saveLoginUserData(loginResult)
                        resolve(loginResult?.user)
                    })
                    .catch((error) => {
                        console.log(error.message)
                        reject(error)
                        // const errorCode = error.code;
                        // const errorMessage = error.message;
                    })
            }
        })
    }

    // логинизация уже существующего юзера через email and password
    signInWithWithEmailAndPassword({ email, password }) {
        return new Promise((resolve, reject) => {
            if (!email || !password) reject(false)
            else {
                const auth = getAuth()
                signInWithEmailAndPassword(auth, email, password)
                    .then((loginResult) => {
                        // if (this.saveCredentialsInLocalStorage) this.saveLoginUserData(loginResult)
                        resolve(loginResult?.user)
                    })
                    .catch((error) => {
                        reject(error)
                        // const errorCode = error.code;
                        // const errorMessage = error.message;
                    })
            }
        })
    }

    async loginWithCredential() {
        return new Promise((resolve, reject) => {
            let credential = localStorage.getItem('authCredential')

            if (credential) {
                credential = JSON.parse(credential)

                credential = GoogleAuthProvider.credential(credential.idToken)

                signInWithCredential(auth, credential)
                    .then((loginResult) => {
                        this.saveLoginUserData(loginResult)
                        resolve(loginResult)
                    })
                    .catch((error) => {
                        console.log(error.message)
                        reject(error)
                        // Handle Errors here.
                        //var errorCode = error.code
                        //var errorMessage = error.message
                        // The email of the user's account used.
                        //var email = error.email
                    })
            } else resolve(false)
        })
    }

    logout() {
        return new Promise((resolve, reject) => {
            signOut(auth)
                .then(() => {
                    localStorage.removeItem(this.authCredentialLocalStorageKey)
                    resolve(true)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}

export default new GoogleAuthOperations(process.env.VUE_APP_SAVE_CREDENTIALS_IN_LOCAL_STORE)
