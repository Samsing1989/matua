<template>
    <tr>
        <td>{{ user.email }}</td>
        <td v-for="(rule, ruleId) in editablePermissionsList()" :key="ruleId">
            <input v-model="userObj.permissions[ruleId]" type="checkbox" />
        </td>
    </tr>
</template>

<script>
import { mapActions } from 'pinia'
import { useUsersStore } from '@/store/modules/users'

export default {
    name: 'UserPageItem',
    props: {
        user: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            userObj: { ...this.user },
            editablePermissions: ['read', 'create', 'update', 'delete'],
        }
    },
    watch: {
        userObj: {
            handler(newUserObj) {
                this.updateUser({
                    id: newUserObj.id,
                    data: {
                        email: newUserObj.email,
                        permissions: newUserObj.permissions,
                    },
                })
            },
            deep: true,
        },
    },
    methods: {
        ...mapActions(useUsersStore, ['updateUser']),

        editablePermissionsList() {
            const obj = {}
            for (const ruleId of this.editablePermissions) {
                obj[ruleId] = this.userObj.permissions[ruleId]
            }
            return obj
        },
    },
}
</script>

<style lang="scss" scoped></style>
