module.exports = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'HomeOutlined',
    component: './TrangChu',
  },
  {
    path: '/fitness',
    name: 'Thể dục',
    icon: 'HeartOutlined',
    component: './Fitness',
  },
  {
    path: '/products',
    name: 'Quản lý sản phẩm',
    icon: 'ShopOutlined',
    component: './ProductManagement',
  },
  {
    path: '/vanbang',
    name: 'Quản lý sổ văn bằng',
    icon: 'BookOutlined',
    component: './VanBang',
  },
  {
    path: '/orders',
    name: 'Quản lý đơn hàng',
    icon: 'ShoppingCartOutlined',
    component: './OrderManagement',
  },
  {
		path: '/club-management',
		name: 'Quản lý CLB',
		icon: 'AppstoreOutlined',
		component: './ClubManagement',
	},
  // Blog
  {
    path: '/blog',
    name: 'Blog',
    icon: 'ReadOutlined',
    routes: [
      {
        path: '/blog',
        redirect: '/blog/home',
      },
      {
        path: '/blog/home',
        name: 'Trang chủ',
        component: './Blog',
      },
      {
        path: '/blog/about',
        name: 'Giới thiệu',
        component: './Blog/About',
      },
      {
        path: '/blog/:slug',
        component: './Blog/[slug]',
        hideInMenu: true,
      },
      {
        path: '/blog/admin',
        name: 'Quản lý',
        routes: [
          {
            path: '/blog/admin/posts',
            name: 'Bài viết',
            component: './Blog/Admin/Posts',
          },
          {
            path: '/blog/admin/tags',
            name: 'Thẻ',
            component: './Blog/Admin/Tags',
          },
        ],
      },
    ],
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
  // Ứng dụng lập kế hoạch du lịch
  {
    path: '/travel',
    name: 'Du lịch',
    icon: 'GlobalOutlined',
    routes: [
      {
        path: '/travel',
        redirect: '/travel/home',
      },
      {
        path: '/travel/home',
        name: 'Khám phá điểm đến',
        icon: 'CompassOutlined',
        component: './Home',
      },
      {
        path: '/travel/trip-planner',
        name: 'Tạo lịch trình',
        icon: 'CalendarOutlined',
        component: './TripPlanner',
      },
      {
        path: '/travel/budget',
        name: 'Quản lý ngân sách',
        icon: 'DollarOutlined',
        component: './BudgetManagement',
      },
      {
        path: '/travel/admin',
        name: 'Quản trị',
        icon: 'SettingOutlined',
        component: './Admin',
      },
    ],
  },
  
];
