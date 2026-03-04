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
];
