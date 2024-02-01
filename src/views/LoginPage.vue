<template>
    <MainMasterPage>
        <div class="login__container">
            <h1 class="login__title">{{ $t('title.loginTitle') }}</h1>
            <label class="login__lable">
                <input v-model="email" type="email" placeholder="Email" class="login__input" />
            </label>
            <label class="login__lable">
                <input v-model="password" type="password" placeholder="password" class="login__input" />
            </label>
            <div class="login__active">
                <button
                    :disabled="!isValid"
                    class="login__button button"
                    @click="registerWithEmailAndPassword(email, password)"
                >
                    {{ $t('button.register') }}
                </button>
                <button
                    class="login__button button"
                    :disabled="!isValid"
                    @click="loginWithEmailAndPassword(email, password)"
                >
                    {{ $t('label.LogIn') }}
                </button>
            </div>
            <lable class="login__title">{{ $t('title.loginTitle2') }}</lable>
            <button class="login__button button" @click="onLoginGoogle">
                <font-awesome-icon :icon="['fab', 'google']" size="2x" style="color: #ffffff" />
            </button>
        </div>
    </MainMasterPage>
</template>

<script>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import { mapActions, mapState } from 'pinia'
import { useAuthStore } from '@/store/modules/auth'
import { useUsersStore } from '@/store/modules/users'
export default {
    name: 'LoginPage',
    components: {
        MainMasterPage,
    },
    data() {
        return {
            email: null,
            password: null,
            errorMessage: null,
        }
    },
    computed: {
        ...mapState(useUsersStore, ['getUserByEmail', 'usersList']),
        isValid() {
            return this.email && this.password
        },
    },
    created() {
        return this.loadUsersList()
    },
    methods: {
        ...mapActions(useAuthStore, [
            'signUpWithWithEmailAndPassword',
            'signInWithWithEmailAndPassword',
            'loginWithGoogleAccount',
        ]),
        ...mapActions(useUsersStore, ['loadUsersList']),
        onLoginGoogle() {
            this.loginWithGoogleAccount().then(() => {
                this.$router.push({
                    name: 'home',
                })
            })
        },
        registerWithEmailAndPassword(email, password) {
            const userEmail = this.getUserByEmail(email)
            if (!userEmail) {
                this.signUpWithWithEmailAndPassword(email, password).then(() => {
                    this.$router.push({
                        name: 'home',
                    })
                })
            } else {
                this.errorMessage = this.$t('messages.email-in')
                alert(this.errorMessage)
                this.email = null
                this.password = null
            }
        },
        loginWithEmailAndPassword(email, password) {
            const userEmail = this.getUserByEmail(email)
            if (userEmail) {
                this.signInWithWithEmailAndPassword(email, password).then(() => {
                    this.$router.push({
                        name: 'home',
                    })
                })
            } else {
                this.errorMessage = this.$t('messages.wrong-message')
                alert(this.errorMessage)
                this.email = null
                this.password = null
            }
        },
    },
}
</script>

<style lang="scss" scoped></style>
