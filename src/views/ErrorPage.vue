<template>
    <main-master-page>
        <div class="error__container">
            <div class="error__icon"><font-awesome-icon :icon="['fas', 'triangle-exclamation']" size="6x" /></div>
            <div class="error__messeger">500</div>
            <button class="error__button button" @click="onBackClick">назат</button>
        </div>
    </main-master-page>
</template>

<script>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
export default {
    name: 'ErrorPage',
    components: {
        MainMasterPage,
    },
    methods: {
        onBackClick() {
            this.$router.go(0)
        },
    },
}
</script>

<style lang="scss" scoped></style>
