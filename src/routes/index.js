import { createRouter, createWebHistory } from 'vue-router';
import Workspace from './Workspace';

export default createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/',
      component: Workspace,
      children: [
        {
          name: 'Workspace',
          path: 'workspaces/:id',
          component: Workspace,
        },
      ],
    },
  ],
});
