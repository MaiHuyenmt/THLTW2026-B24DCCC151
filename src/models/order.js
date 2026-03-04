export default {
  namespace: 'order',

  state: {
    list: JSON.parse(localStorage.getItem('orders')) || [],
  },

  reducers: {
    save(state, { payload }) {
      localStorage.setItem('orders', JSON.stringify(payload));
      return { ...state, list: payload };
    },
  },
};
