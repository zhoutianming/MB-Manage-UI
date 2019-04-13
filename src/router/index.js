import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/common/Home'
// import Dashboard from '@/components/page/Dashboard'
import User from '@/components/page/UserManage'
import Message from '@/components/page/MessageManage'
import Review from '@/components/page/ReviewManage'
import adminLogin from '@/components/page/Login'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/admin',
      component: Home,
      children:[
        // {
        //   path: '/dashboard',
        //   component: Dashboard
        // },
        {
          path: '/user',
          component: User
        },
        {
          path: '/message',
          component: Message
        },
        {
          path: '/review',
          component: Review
        }
      ]
    },
    {
      path: '/login',
      component: adminLogin
    }
  ]
})
