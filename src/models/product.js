export default {
  namespace: 'product',

  state: {
    list: JSON.parse(localStorage.getItem('products')) || [
      { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
      { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
    ],
  },

  reducers: {
    save(state, { payload }) {
      localStorage.setItem('products', JSON.stringify(payload));
      return { ...state, list: payload };
    },
  },
};
