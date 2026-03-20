import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  Package, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  Search,
  Plus,
  Minus
} from 'lucide-react';
import { cn, getSessionId } from './lib/utils';

// --- Types ---
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

// --- Components ---

const Navbar = ({ user, onLogout, cartCount, onCartClick }: { user: any, onLogout: () => void, cartCount: number, onCartClick: () => void }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-zinc-200 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-200">
          A
        </div>
        <span className="font-bold text-xl tracking-tight text-zinc-900 hidden sm:block">AutoPractice<span className="text-emerald-500">Pro</span></span>
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <div className="flex items-center gap-3 px-3 py-1.5 bg-zinc-100 rounded-full border border-zinc-200">
              <User size={16} className="text-zinc-500" />
              <span className="text-sm font-medium text-zinc-700">{user.name}</span>
            </div>
            <button 
              onClick={onCartClick}
              id={getSessionId('nav-cart-btn')}
              className="relative p-2 text-zinc-600 hover:text-emerald-600 transition-colors group"
              aria-label="View Cart"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full" />
            </button>
            <button 
              onClick={onLogout}
              id={getSessionId('nav-logout-btn')}
              className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-red-500 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </>
        ) : (
          <div className="text-sm font-medium text-zinc-400 italic">Not Logged In</div>
        )}
      </div>
    </nav>
  );
};

const ProductCard = ({ product, onAddToCart }: { product: Product, onAddToCart: (p: Product) => void, key?: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white border border-zinc-200 rounded-2xl p-5 hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-100 px-2 py-1 rounded">
          {product.category}
        </span>
      </div>

      <div className="w-full aspect-square bg-zinc-50 rounded-xl mb-4 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
        <Package size={48} className="text-zinc-300 group-hover:text-emerald-300 transition-colors" />
      </div>

      <h3 className="font-bold text-zinc-900 mb-1 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
      <p className="text-zinc-500 text-sm mb-4">High-performance tech component for automation testing.</p>
      
      <div className="flex items-center justify-between mt-auto">
        <span className="text-lg font-bold text-zinc-900">${product.price.toFixed(2)}</span>
        <button 
          id={getSessionId(`add-to-cart-${product.id}`)}
          data-product-id={product.id}
          onClick={() => onAddToCart(product)}
          className="p-2 bg-zinc-900 text-white rounded-lg hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-zinc-200"
          title="Add to Cart"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Hover Reveal Info - Good for testing hover actions */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-x-0 bottom-0 bg-emerald-600 p-3 text-white text-xs font-medium text-center"
          >
            Stock available: {product.stock} units
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CartDrawer = ({ isOpen, onClose, items, onUpdateQuantity, onClear, onCheckout }: { 
  isOpen: boolean, 
  onClose: () => void, 
  items: CartItem[], 
  onUpdateQuantity: (id: string, delta: number) => void,
  onClear: () => void,
  onCheckout: () => void
}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                <ShoppingCart size={24} className="text-emerald-500" />
                Your Shopping Cart
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-4">
                  <Package size={64} strokeWidth={1} />
                  <p className="font-medium">Your cart is empty</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-zinc-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package size={24} className="text-zinc-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-zinc-900 text-sm">{item.name}</h4>
                      <p className="text-zinc-500 text-xs">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-zinc-100 rounded-lg p-1">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-1 hover:bg-white rounded transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="p-1 hover:bg-white rounded transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-medium">Subtotal</span>
                  <span className="text-xl font-bold text-zinc-900" id="cart-total-price">${total.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={onClear}
                    id={getSessionId('clear-cart-btn')}
                    className="flex items-center justify-center gap-2 py-3 border border-zinc-200 rounded-xl text-zinc-600 font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                  >
                    <Trash2 size={18} />
                    Clear
                  </button>
                  <button 
                    onClick={onCheckout}
                    id={getSessionId('checkout-btn')}
                    className="flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                  >
                    Checkout
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [searchQuery, setSearchQuery] = useState('');

  // --- API Handlers ---

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}!`, {
          description: "You have successfully logged in via API.",
          icon: <CheckCircle className="text-emerald-500" />
        });
      } else {
        toast.error('Login Failed', {
          description: data.message || "Invalid credentials. Try admin/password123",
          icon: <AlertCircle className="text-red-500" />
        });
      }
    } catch (err) {
      toast.error('Network Error');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    toast.info("Logged out successfully");
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`Added ${product.name} to cart`, {
      action: {
        label: 'View Cart',
        onClick: () => setIsCartOpen(true)
      }
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setCart([]);
    toast.info("Cart cleared");
  };

  const handleCheckout = () => {
    toast.success("Order Placed!", {
      description: "Your automated shopping scenario is complete.",
      duration: 5000
    });
    setCart([]);
    setIsCartOpen(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 font-sans">
        <Toaster position="top-right" richColors />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-xl shadow-zinc-200/50">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-emerald-200 mb-4">
                A
              </div>
              <h1 className="text-2xl font-bold text-zinc-900">Automation Practice</h1>
              <p className="text-zinc-500 text-sm">Sign in to start your test scenario</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Username</label>
                <input 
                  type="text"
                  id={getSessionId('login-username')}
                  name="username"
                  value={loginForm.username}
                  onChange={e => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="admin"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Password</label>
                <input 
                  type="password"
                  id={getSessionId('login-password')}
                  name="password"
                  value={loginForm.password}
                  onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="password123"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  required
                />
              </div>
              <button 
                type="submit"
                id={getSessionId('login-submit-btn')}
                className="w-full py-4 bg-zinc-900 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-zinc-200 transition-all active:scale-[0.98] mt-2"
              >
                Sign In
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-zinc-100">
              <p className="text-[10px] text-center text-zinc-400 uppercase tracking-widest font-bold">
                Hint: admin / password123
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans pt-24 pb-12 px-6">
      <Toaster position="top-right" richColors />
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)}
      />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQuantity={updateQuantity}
        onClear={clearCart}
        onCheckout={handleCheckout}
      />

      <main className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 mb-2">Modern Tech Store</h2>
            <p className="text-zinc-500">Select products to test your dynamic locator strategies.</p>
          </div>
          
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text"
              placeholder="Search products or categories..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm transition-all"
            />
          </div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 bg-white border border-zinc-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
              />
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-zinc-400 font-medium">No products match your search.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-400 text-xs font-medium uppercase tracking-widest">
        <div>© 2026 Automation Practice Pro</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-emerald-500 transition-colors">API Documentation</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Test Scenarios</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
