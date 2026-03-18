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
  // Bai thuc hanh 01
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
  //Bai thuc hanh 02
  {
    path: '/bai1',
    name: 'Oẳn tù tì',
    component: './Bai1',
  },
  {
    path: '/bai2',
    name: 'Ngân hàng câu hỏi',
    component: './Bai2',
  },
  //Bai thuc hanh 03
  {
    path: '/TH03',
    name: 'Quản lý đặt lịch',
    component: './TH03',
  }
];
