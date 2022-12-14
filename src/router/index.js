import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Group from '@/components/Group'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path:'/group',
      name:'Group',
      component:Group
    }
  ]
})
