import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomePage/HomeView.vue'
import { isAuthenticated } from './helpers'
import LoginPage from '@/views/LoginPage.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        meta: {
            requireAuth: false,
        },
        component: HomeView,
    },
    {
        path: '/news',
        name: 'news',
        meta: {
            requireAuth: false,
        },
        component: () => import('@/views/News/NewsPage.vue'),
    },
    {
        path: '/watches',
        name: 'watches',
        meta: {
            requireAuth: false,
        },
        component: () => import('@/views/Product/ProductPage.vue'),
    },
    {
        path: '/basket',
        name: 'basket',
        meta: {
            requireAuth: true,
        },
        component: () => import('@/views/Basket/BasketPage.vue'),
    },
    {
        path: '/config/:id?',
        name: 'product-config',
        meta: {
            requireAuth: true,
        },
        component: () => import('@/views/Product/ProductEdit.vue'),
    },
    {
        path: '/swiper-config/:id?',
        name: 'swiper-config',
        meta: {
            requireAuth: true,
        },
        component: () => import('@/views/HomePage/SwiperEdit'),
    },
    {
        path: '/news-config/:id?',
        name: 'news-config',
        meta: {
            requireAuth: true,
        },
        component: () => import('@/views/News/NewsEdit.vue'),
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            requireAuth: false,
        },
        component: LoginPage,
        //   component: () => import('@/views/LoginPage.vue'),
    },
    {
        path: '/users',
        name: 'users',
        meta: {
            requireAuth: true,
        },
        component: () => import('@/views/UserPage/UserPage.vue'),
    },

    {
        path: '/:path(.*)*',

        name: 'page-not-found',
        meta: {
            requireAuth: false,
        },
        component: () => import('@/views/PageNotFound.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})
router.beforeEach(async (to) => {
    if (to.meta?.requireAuth) {
        if (!isAuthenticated())
            return {
                name: 'login',
            }
        //   if (!isRouteAvailable(to)) {
        //       return {
        //           name: 'page-not-found',
        //       }
        //   }
    }
})

export default router
