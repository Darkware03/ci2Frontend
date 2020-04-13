
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/chat/:otherUserId', component: () => import('pages/Chat.vue') },
      { path: '/auth', component: () => import('pages/auth_page.vue') },
      { path: '/user', component: () => import('pages/user_page.vue') },
      { path: '/singIn', component: () => import('pages/register.vue') }

    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
