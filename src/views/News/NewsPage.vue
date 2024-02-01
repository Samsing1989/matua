<template>
    <main-master-page>
        <news-list />
    </main-master-page>
</template>

<script>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import NewsList from '@/views/News/NewsList.vue'
export default {
    name: 'NewsPage',
    components: {
        MainMasterPage,
        NewsList,
    },
}
</script>

<style lang="scss" scoped></style>
