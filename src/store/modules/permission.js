import { constantRoutes } from '@/router'
import { getRouters } from '@/api/resource'
import Layout from '@/layout/index'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      getRouters().then(res => {
        const accessedRoutes = filterAsyncRouter(res.data)
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

function filterAsyncRouter(routes) {
  return routes.filter((route) => {
    const component = route.component
    if (component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = loadView(component)
      }
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
      return true
    }
  })
}

export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}.vue`], resolve)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
