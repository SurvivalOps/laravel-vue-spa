import store from '~/store'

export default (to, from, next) => {
  if (!store.getters['auth/check']) {
    next({ name: 'login' })
  } else if (store.getters['auth/user'].role !== 'super-admin' && store.getters['auth/user'].role !== 'admin') {
    next({ name: 'home' })
  } else {
    next()
  }
}
