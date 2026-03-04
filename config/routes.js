module.exports = [
  {
    path: '/',
    redirect: '/products',
  },
  {
    path: '/products',
    name: 'Quản lý sản phẩm',
    icon: 'ShopOutlined',
    component: './ProductManagement',
  },
  {
    path: '/game',
    name: 'Game',
    component: './Game',
  },
  {
    path: '/study',
    name: 'Study',
    component: './Study',
  },
];
