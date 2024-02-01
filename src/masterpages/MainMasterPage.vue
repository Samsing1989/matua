<template>
    <div class="wrapper">
        <header class="header">
            <div class="header__container">
                <router-link :to="{ name: 'home' }" class="header__logo">
                    <img src="@/assets/img/logo.svg" alt="logo" />
                </router-link>
                <div class="header__menu menu" :class="menuOpen">
                    <nav class="menu__body">
                        <router-link :to="{ name: 'watches' }" class="menu__link">{{ $t('nav.products') }}</router-link>
                        <router-link :to="{ name: 'news' }" class="menu__link">{{ $t('nav.news') }}</router-link>
                    </nav>
                </div>
                <div class="header__active" :class="menuOpen">
                    <div class="header__active-links">
                        <div class="header__lang" @click="changeLocale">
                            <span>{{ currentLanguage }}</span>
                        </div>

                        <div class="header__link login-header">
                            <div v-if="getUser" class="login-header__container">
                                <div class="login-header__image">
                                    <img v-if="getUser.photoURL" :src="getUser.photoURL" />
                                    <font-awesome-icon v-else icon="user" size="2x" style="color: #281717" />
                                </div>
                                <div class="login-header__active">
                                    <span>{{ getUser.email }}</span>
                                    <button class="login-header__button button" @click="onLogout">
                                        {{ $t('button.onLogout') }}
                                    </button>
                                </div>
                            </div>
                            <button v-else class="login-header__button-login button" @click="onLogin">
                                {{ $t('label.LogIn') }}
                            </button>
                        </div>
                        <router-link v-if="getUser" :to="{ name: 'basket' }" class="header__link link-basket">
                            <font-awesome-icon icon="cart-shopping" style="color: #281717" />
                            <span v-if="getUser && cartList?.length" class="header__basket-span">{{
                                getBasketCount
                            }}</span>
                        </router-link>
                    </div>
                    <button type="button" class="header__icon icon-menu" @click="openMenuMob">
                        <span></span>
                    </button>
                </div>
            </div>
        </header>
        <main class="main">
            <loading-page v-if="isLoading" />
            <error-page v-else-if="hasError" />
            <template v-if="!hasError">
                <slot></slot>
            </template>
        </main>
        <footer class="footer">
            <div class="footer__contacts contacts">
                <div class="contacts__container">
                    <div class="contacts__row">
                        <div class="contacts__column">
                            <div class="contacts__logo"><img src="@/assets/img/logo-footer.svg" alt="logo" /></div>
                            <label class="contacts__label">{{ $t('label.addressLabel') }}</label>

                            <div class="contacts__text">
                                <p>{{ $t('text.fotterTextAdress1') }}</p>
                                <p>{{ $t('text.fotterTextAdress2') }}</p>
                                <p>{{ $t('text.fotterTextAdress3') }}</p>
                                <p>{{ $t('text.fotterTextAdress4') }}</p>
                            </div>
                            <label class="contacts__label">{{ $t('label.officeLabel') }}</label>
                            <div class="contacts__text">
                                <p>{{ $t('text.fotterTextDay') }}</p>
                                <p>10.00 - 18.00</p>
                            </div>
                        </div>
                        <div class="contacts__column">
                            <h3 class="contacts__title title title_white">{{ $t('title.footerTitle') }}</h3>
                            <a href="tel:02220277564" class="contacts__tel-link"
                                ><label class="contacts__label-tel">{{ $t('label.phoneLable') }}</label
                                ><span class="contacts__span">022-20277564</span></a
                            >
                            <a href="tel:08112338899" class="contacts__tel-link"
                                ><label class="contacts__label-tel">{{ $t('label.serviceLable') }}</label
                                ><span class="contacts__span">0811-233-8899</span></a
                            >
                            <a href="tel:08112359988" class="contacts__tel-link"
                                ><label class="contacts__label-tel">{{ $t('label.customerLable') }}</label
                                ><span class="contacts__span">0811-235-9988</span></a
                            >
                            <ul class="contacts__social-list">
                                <li class="contacts__solial-item">
                                    <a href="#" class="contacts__social-link"
                                        ><font-awesome-icon :icon="['fab', 'facebook']" style="color: #ffffff"
                                    /></a>
                                </li>
                                <li class="contacts__solial-item">
                                    <a href="#" class="contacts__social-link"
                                        ><font-awesome-icon :icon="['fab', 'square-instagram']" style="color: #ffffff"
                                    /></a>
                                </li>
                                <li class="contacts__solial-item">
                                    <a href="#" class="contacts__social-link"
                                        ><font-awesome-icon :icon="['fab', 'square-twitter']" style="color: #ffffff"
                                    /></a>
                                </li>
                                <li class="contacts__solial-item">
                                    <a href="#" class="contacts__social-link"
                                        ><font-awesome-icon :icon="['fab', 'youtube']" style="color: #ffffff"
                                    /></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useAuthStore } from '@/store/modules/auth'
import { useGeneralStore } from '@/store/modules/general'
import { useUsersStore } from '@/store/modules/users'
import { useBasketStore } from '@/store/modules/basket'
import LoadingPage from '@/views/LoadingPage.vue'
import ErrorPage from '@/views/ErrorPage.vue'
export default {
    name: 'MainMasterPage',
    components: {
        LoadingPage,
        ErrorPage,
    },
    data() {
        return {
            menuOpen: null,
            noMenuOpen: false,
            cartList: null,
        }
    },
    computed: {
        ...mapState(useAuthStore, ['getUser']),
        ...mapState(useGeneralStore, ['isLoading', 'hasError']),
        ...mapState(useUsersStore, ['getCurrentUserPermissions']),
        ...mapState(useBasketStore, ['getCurrentBasket']),
        currentLanguage() {
            return this.$i18n.locale === 'ua' ? 'УК' : 'EN'
        },
        getBasketCount() {
            return this.cartList?.length
        },
    },
    async created() {
        this.$i18n.locale = JSON.parse(localStorage.getItem('lastLocale')) ?? process.env.VUE_APP_I18N_LOCALE

        const self = this
        window.addEventListener('storage', function () {
            if (self.$i18n.locale !== localStorage.getItem('lastLocale')) {
                self.$i18n.locale = localStorage.getItem('lastLocale')
                self.$router.go()
            }
        })

        if (this.getUser) {
            await this.getItemByIdFromList(this.getUser.uid)
            this.cartList = this.getCurrentBasket?.basket
        }
    },
    methods: {
        ...mapActions(useAuthStore, ['logOut']),
        ...mapActions(useBasketStore, ['getItemByIdFromList']),
        changeLocale() {
            this.$i18n.locale === 'en' ? (this.$i18n.locale = 'ua') : (this.$i18n.locale = 'en')
            localStorage.setItem('lastLocale', JSON.stringify(this.$i18n.locale))
        },

        openMenuMob() {
            this.noMenuOpen = !this.noMenuOpen
            if (this.noMenuOpen) {
                this.menuOpen = 'menu-open'
                document.body.classList.add('lock')
            } else {
                this.menuOpen = null
                document.body.classList.remove('lock')
            }
        },
        closedMenu() {
            this.menuOpen = null
            document.body.classList.remove('lock')
        },
        onLogin() {
            this.$router.push({
                name: 'login',
            })
        },
        onLogout() {
            this.logOut()
            this.$router.push({
                name: 'login',
            })
        },
    },
}
</script>

<style lang="scss">
@import '@/assets/style';
</style>
