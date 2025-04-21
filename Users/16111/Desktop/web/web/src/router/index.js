const routes = [
  {
    path: '/',
    name: 'Home',
    component: App,
  },
  {
    path: '/edit',
    name: 'EditPage',
    component: () => import('../components/EditPage.vue'), // 动态导入编辑页组件
  },
];