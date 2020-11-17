import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  debugger
  if (value && value instanceof Array && value.length > 0) {
    const userPermissions = store.getters && store.getters.permissions
    const permissions = value

    const hasPermission = userPermissions.some(permission => {
      return permissions.includes(permission)
    })
    return hasPermission
  } else {
    console.error(`need permissions! Like v-permission="['admin','editor']"`)
    return false
  }
}
