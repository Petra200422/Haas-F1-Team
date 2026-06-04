const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/team', component: () => import('pages/TeamPage.vue')},
      { path: '/member/:id', component: () => import('pages/TeamMemberPage.vue')},
      { path: '/car', component: () => import('pages/CarPage.vue')},
      { path: '/standings', component: () => import('pages/StandingsPage.vue')},
      { path: '/schedule', component: () => import('pages/SchedulePage.vue')},
      { path: '/race/:id', component: () => import('pages/RacePage.vue')},
      { path: '/articles', component: () => import('pages/ArticlesPage.vue')},
      { path: '/newArticle', component: () => import('pages/NewArticlePage.vue')},
      { path: '/article/:id', component: () => import('pages/ArticlePage.vue')},
      { path: '/editArticle/:id', component: () => import('pages/EditArticlePage.vue')},
      { path: '/contact', component: () => import('pages/ContactPage.vue')},
      { path: '/partners', component: () => import('pages/PartnersPage.vue')},
      { path: '/partner/:id', component: () => import('pages/PartnerPage.vue')},
      { path: '/adminLogin', component: () => import('pages/AdminLoginPage.vue')}],


},
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes

