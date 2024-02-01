<template>
    <main-master-page>
        <div class="page-not-found__container">
            <div class="page-not-found__item">4<span class="page-not-found__span"></span>4</div>
            <div class="page-not-found__item">Error</div>
            <router-link :to="{ name: 'home' }" class="page-not-found__button button" />
        </div>
    </main-master-page>
</template>

<script>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
export default {
    name: 'PageNotFound',
    components: {
        MainMasterPage,
    },
}
</script>

<style lang="scss" scoped></style>
