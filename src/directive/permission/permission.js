import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const userPermissions = store.getters && store.getters.permissions

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissions = value

      const hasPermission = userPermissions.some(permission => {
        return permissions.includes(permission)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need perimissions! Like v-permission="['admin','editor']"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
