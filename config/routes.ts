export default [
	{
		path: '/',
		redirect: '/travel/home',
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/fitness',
		name: 'Thể dục',
		component: './Fitness',
		icon: 'HeartOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
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

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
		redirect: '/dashboard',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
