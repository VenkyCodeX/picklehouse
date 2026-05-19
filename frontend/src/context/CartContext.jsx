import { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const key = `${action.item.productId}-${action.item.weight}`;
      const existing = state.items.find(i => `${i.productId}-${i.weight}` === key);
      if (existing) {
        return { ...state, items: state.items.map(i => `${i.productId}-${i.weight}` === key ? { ...i, quantity: i.quantity + (action.item.quantity || 1) } : i) };
      }
      return { ...state, items: [...state.items, { ...action.item, quantity: action.item.quantity || 1 }] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => `${i.productId}-${i.weight}` !== action.key) };
    case 'UPDATE_QTY':
      return { ...state, items: state.items.map(i => `${i.productId}-${i.weight}` === action.key ? { ...i, quantity: Math.max(1, action.qty) } : i) };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'TOGGLE_DRAWER':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_DRAWER':
      return { ...state, isOpen: true };
    case 'CLOSE_DRAWER':
      return { ...state, isOpen: false };
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: JSON.parse(localStorage.getItem('pickleCart') || '[]'),
    isOpen: false,
  });

  useEffect(() => {
    localStorage.setItem('pickleCart', JSON.stringify(cart.items));
  }, [cart.items]);

  const addToCart = (item) => {
    dispatch({ type: 'ADD', item });
    dispatch({ type: 'OPEN_DRAWER' });
    toast.success(`${item.name} added to cart! 🛒`, { style: { background: '#3E1F00', color: '#FFF8F0' } });
  };

  const removeFromCart = (key) => dispatch({ type: 'REMOVE', key });
  const updateQty = (key, qty) => dispatch({ type: 'UPDATE_QTY', key, qty });
  const clearCart = () => dispatch({ type: 'CLEAR' });
  const toggleDrawer = () => dispatch({ type: 'TOGGLE_DRAWER' });
  const closeDrawer = () => dispatch({ type: 'CLOSE_DRAWER' });

  const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, toggleDrawer, closeDrawer, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
