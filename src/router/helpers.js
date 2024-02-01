import { useAuthStore } from '@/store/modules/auth'
import { useUsersStore } from '@/store/modules/users'

export function isAuthenticated() {
    return useAuthStore().getUser
}

export function isRouteAvailable(routeItem) {
    const { getCurrentUserPermissions, getCurrentUser } = useUsersStore()
    return (
        !routeItem.meta?.requireAuth ||
        (routeItem.meta?.hasAccess && routeItem.meta.hasAccess(getCurrentUserPermissions)) ||
        (!routeItem.meta?.hasAccess && getCurrentUser)
    )
}
