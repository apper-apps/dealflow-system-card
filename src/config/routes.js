import Home from '@/components/pages/Home';
import Categories from '@/components/pages/Categories';
import Trending from '@/components/pages/Trending';
import SwipeDeals from '@/components/pages/SwipeDeals';
import SubmitDeal from '@/components/pages/SubmitDeal';
import DealDetail from '@/components/pages/DealDetail';
import Dashboard from '@/components/pages/Dashboard';
import EmailBuilder from '@/components/pages/EmailBuilder';
import NotFound from '@/components/pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home,
    showInNav: true
  },
  categories: {
    id: 'categories',
    label: 'Categories',
    path: '/categories',
    icon: 'Grid3X3',
    component: Categories,
    showInNav: true
  },
  trending: {
    id: 'trending',
    label: 'Trending',
    path: '/trending',
    icon: 'TrendingUp',
    component: Trending,
    showInNav: true
},
  swipe: {
    id: 'swipe',
    label: 'Swipe',
    path: '/swipe',
    icon: 'Heart',
    component: SwipeDeals,
    showInNav: true
  },
  submitDeal: {
    id: 'submitDeal',
    label: 'Submit Deal',
    path: '/submit',
    icon: 'Plus',
    component: SubmitDeal,
    showInNav: true
  },
  dealDetail: {
    id: 'dealDetail',
    label: 'Deal Detail',
    path: '/deal/:id',
    icon: 'FileText',
    component: DealDetail,
    showInNav: false
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard,
    showInNav: false
  },
  emailBuilder: {
    id: 'emailBuilder',
    label: 'Email Builder',
    path: '/email-builder',
    icon: 'Mail',
    component: EmailBuilder,
    showInNav: false
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    icon: 'AlertCircle',
    component: NotFound,
    showInNav: false
  }
};

export const routeArray = Object.values(routes);
export default routes;