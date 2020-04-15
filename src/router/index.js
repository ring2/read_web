import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/components/Login')
  },
  {
    path: '/user',
    component: () => import('@/components/user/User.vue')
  },
  {
    path: '/home',
    component: () => import('@/components/Home'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('@/components/Welcome')
      },
      {
        path: '/home/user',
        component: () => import('@/components/user/User')
      },
      {
        path: '/home/expert',
        component: () => import('@/components/expert/Expert')
      },
      {
        path: '/home/recommend',
        component: () => import('@/components/expert/Recommend')
      },
      {
        path: '/home/book',
        component: () => import('@/components/book/Book')
      },
      {
        path: '/home/reviewed',
        component: () => import('@/components/book/Reviewed')
      },
      {
        path: '/home/bookType',
        component: () => import('@/components/book/BookType')
      },
      {
        path: '/home/announcement',
        component: () => import('@/components/announcement/Announcement')
      },
      {
        path: '/home/resource',
        component: () => import('@/components/bookresource/Resource')
      },
      {
        path: '/home/booktoken',
        component: () => import('@/components/booktoken/BookToken')
      },
      {
        path: '/home/borrow',
        component: () => import('@/components/borrow/Borrow')
      },
      {
        path: '/home/personal',
        component: () => import('@/components/my/Personal')
      },
      {
        path: '/home/read_rank',
        component: () => import('@/components/datacount/ReadRank')
      },
      {
        path: '/home/reader_rank',
        component: () => import('@/components/datacount/ReaderRank')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') return next()
//   const user = window.sessionStorage.getItem('user')
//   if (!user) return next('/login')
//   next()
// })

export default router
