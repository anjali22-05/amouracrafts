import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  PlusCircle,
  Package,
  Edit3,
  Trash2,
  Eye,
  LogOut,
  Key,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Sparkles,
  Camera,
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { productService, compressImageFile } from '../../services/productService';
import { formatINR } from '../../utils/formatters';

const CATEGORIES = [
  { id: 'candles', label: 'Candles (Candles Collection)' },
  { id: 'resin', label: 'Resin Art (Resin Collection)' },
  { id: 'plants', label: 'Botanical & Plants (Plants Collection)' }
];

export default function AdminDashboard() {
  const { isAuthenticated, isLoading, logout, changePassword } = useAuth();
  const navigate = useNavigate();

  // Active Sidebar Tab: 'overview' | 'products' | 'orders' | 'customers'
  const [activeTab, setActiveTab] = useState('products');

  // Products state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    mrp: '',
    category: 'candles',
    tag: 'New Arrival',
    desc: '',
    img: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // View Product Modal State
  const [viewingProduct, setViewingProduct] = useState(null);

  // Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [passwordStatus, setPasswordStatus] = useState({ type: '', text: '' });
  const [isChangingPass, setIsChangingPass] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const loadCustomProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await productService.getProducts((remote) => {
        setProducts(remote);
      });
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadCustomProducts();
    }
  }, [isAuthenticated]);

  const handleImageFileChange = async (e, isEdit = false) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      const compressedDataUrl = await compressImageFile(file, 800, 800, 0.82);
      if (isEdit) {
        setEditingProduct(prev => ({ ...prev, img: compressedDataUrl }));
        setEditImagePreview(compressedDataUrl);
      } else {
        setNewProduct(prev => ({ ...prev, img: compressedDataUrl }));
        setImagePreview(compressedDataUrl);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to process image. Please choose another file.' });
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    if (!newProduct.name.trim() || !newProduct.price) {
      setStatusMessage({ type: 'error', text: 'Product name and selling price are required.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const added = await productService.addProduct({
        ...newProduct,
        img: newProduct.img || '/images/logo.png'
      });

      setStatusMessage({ type: 'success', text: `✨ "${added.name}" added and published to the live website!` });
      setNewProduct({
        name: '',
        price: '',
        mrp: '',
        category: 'candles',
        tag: 'New Arrival',
        desc: '',
        img: ''
      });
      setImagePreview('');
      loadCustomProducts();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to add product.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (p) => {
    setEditingProduct({ ...p });
    setEditImagePreview(p.img);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsUpdating(true);
    try {
      await productService.updateProduct(editingProduct);
      setEditingProduct(null);
      setStatusMessage({ type: 'success', text: `✨ "${editingProduct.name}" updated successfully!` });
      loadCustomProducts();
    } catch (err) {
      alert('Error updating product: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProduct = async (p) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${p.name}"? This product will be permanently removed from the website.`);
    if (!confirmDelete) return;

    try {
      await productService.deleteProduct(p.id, p.name);
      setStatusMessage({ type: 'success', text: `Deleted "${p.name}".` });
      loadCustomProducts();
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus({ type: '', text: '' });

    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordStatus({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    if (passwordForm.next.length < 6) {
      setPasswordStatus({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await changePassword(passwordForm.current, passwordForm.next);
      if (res.success) {
        setPasswordStatus({ type: 'success', text: res.message || 'Password changed successfully!' });
        setPasswordForm({ current: '', next: '', confirm: '' });
        setTimeout(() => setIsPasswordModalOpen(false), 1600);
      } else {
        setPasswordStatus({ type: 'error', text: res.error || 'Failed to change password.' });
      }
    } catch (err) {
      setPasswordStatus({ type: 'error', text: err.message || 'Network error.' });
    } finally {
      setIsChangingPass(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-amoura-forest text-sm font-semibold animate-pulse">Loading Admin Portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amoura-ivory py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Header Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white border border-amoura-border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-amoura-cream border border-amoura-border flex items-center justify-center text-amoura-forest shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-amoura-sage-dark font-bold block">
              2026 Admin Portal
            </span>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-amoura-charcoal">
              Amoura Crafts Dashboard
            </h1>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amoura-cream border border-amoura-border text-amoura-charcoal hover:border-amoura-forest transition-colors shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amoura-forest" />
            <span>View Live Site</span>
          </Link>

          <button
            onClick={() => {
              setIsPasswordModalOpen(true);
              setPasswordStatus({ type: '', text: '' });
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amoura-cream border border-amoura-border text-amoura-charcoal hover:border-amoura-forest transition-colors shadow-sm cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-amoura-forest" />
            <span>Password</span>
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors shadow-sm cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Active Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Modern Sidebar (3 cols on lg) */}
        <div className="lg:col-span-3 bg-white border border-amoura-border rounded-2xl p-4 shadow-soft space-y-1.5">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'bg-amoura-forest text-amoura-ivory shadow-sm'
                : 'text-amoura-charcoal hover:bg-amoura-cream'
            }`}
          >
            <span className="flex items-center gap-2">
              <Package className="w-4 h-4" /> Product Manager
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
              activeTab === 'products' ? 'bg-white/20 text-white' : 'bg-amoura-cream text-amoura-forest'
            }`}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-amoura-forest text-amoura-ivory shadow-sm'
                : 'text-amoura-charcoal hover:bg-amoura-cream'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Overview &amp; Analytics
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amoura-forest text-amoura-ivory shadow-sm'
                : 'text-amoura-charcoal hover:bg-amoura-cream'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Order History &amp; Dispatch
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-amoura-forest text-amoura-ivory shadow-sm'
                : 'text-amoura-charcoal hover:bg-amoura-cream'
            }`}
          >
            <Users className="w-4 h-4" /> Customer Inquiries
          </button>
        </div>

        {/* Content Area (9 cols on lg) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Status Alert Notification */}
          {statusMessage.text && (
            <div
              className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                  : 'bg-rose-50 border border-rose-300 text-rose-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>{statusMessage.text}</span>
              </div>
              <button
                onClick={() => setStatusMessage({ type: '', text: '' })}
                className="p-1 hover:opacity-75 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 1: PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <>
              {/* Add Product Card */}
              <div className="bg-white border border-amoura-border rounded-2xl p-5 sm:p-7 shadow-soft">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-amoura-border">
                  <PlusCircle className="w-5 h-5 text-amoura-forest" />
                  <h2 className="font-serif text-xl font-bold text-amoura-charcoal">
                    Add New Product
                  </h2>
                  <span className="text-[11px] text-amoura-muted ml-auto hidden sm:block">
                    Auto-publishes to live category page
                  </span>
                </div>

                <form onSubmit={handleAddProduct} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Image Upload Area */}
                    <div className="lg:col-span-4 space-y-3">
                      <label className="block text-xs font-semibold text-amoura-charcoal">
                        Product Image *
                      </label>

                      <div className="relative aspect-square w-full rounded-2xl border-2 border-dashed border-amoura-border hover:border-amoura-forest bg-amoura-ivory flex flex-col items-center justify-center p-4 text-center cursor-pointer overflow-hidden transition-colors group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileChange(e, false)}
                          className="absolute inset-0 opacity-0 cursor-pointer z-20"
                        />

                        {imagePreview ? (
                          <div className="relative w-full h-full">
                            <img
                              src={imagePreview}
                              alt="Product Preview"
                              className="w-full h-full object-cover rounded-xl"
                            />
                            <div className="absolute inset-0 bg-amoura-charcoal/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs text-white gap-1.5 font-medium">
                              <Camera className="w-4 h-4" /> Change Image
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 text-amoura-muted">
                            <div className="w-12 h-12 rounded-full bg-white border border-amoura-border flex items-center justify-center mx-auto text-amoura-forest shadow-sm">
                              <Upload className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-amoura-charcoal">Click or drag image here</p>
                              <p className="text-[10px] text-amoura-muted mt-0.5">Auto-compresses to lightweight WebP</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {imagePreview && (
                        <button
                          type="button"
                          onClick={() => { setImagePreview(''); setNewProduct(prev => ({ ...prev, img: '' })); }}
                          className="text-[11px] text-rose-600 hover:underline block text-center w-full cursor-pointer"
                        >
                          Remove Selected Image
                        </button>
                      )}
                    </div>

                    {/* Details Fields */}
                    <div className="lg:col-span-8 space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-amoura-charcoal mb-1">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Royal Urli Scented Candle"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-ivory border border-amoura-border text-xs text-amoura-charcoal placeholder-amoura-muted focus:outline-none focus:border-amoura-forest"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-amoura-charcoal mb-1">
                            Selling Price (₹) *
                          </label>
                          <input
                            type="number"
                            required
                            min={0}
                            placeholder="e.g. 550"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-ivory border border-amoura-border text-xs text-amoura-charcoal placeholder-amoura-muted focus:outline-none focus:border-amoura-forest"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-amoura-charcoal mb-1">
                            Original Price / MRP (₹)
                          </label>
                          <input
                            type="number"
                            min={0}
                            placeholder="e.g. 699 (Optional strike-through)"
                            value={newProduct.mrp}
                            onChange={(e) => setNewProduct({ ...newProduct, mrp: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-ivory border border-amoura-border text-xs text-amoura-charcoal placeholder-amoura-muted focus:outline-none focus:border-amoura-forest"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-amoura-charcoal mb-1">
                            Category *
                          </label>
                          <select
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-ivory border border-amoura-border text-xs text-amoura-charcoal focus:outline-none focus:border-amoura-forest"
                          >
                            {CATEGORIES.map(c => (
                              <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-amoura-charcoal mb-1">
                            Badge Tag (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Bestseller, New Arrival, Festive Special"
                            value={newProduct.tag}
                            onChange={(e) => setNewProduct({ ...newProduct, tag: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-ivory border border-amoura-border text-xs text-amoura-charcoal placeholder-amoura-muted focus:outline-none focus:border-amoura-forest"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-amoura-charcoal mb-1">
                          Short Description
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Handcrafted pure soy wax creation with dried botanicals. Perfect for home decor and festive gifting."
                          value={newProduct.desc}
                          onChange={(e) => setNewProduct({ ...newProduct, desc: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-amoura-ivory border border-amoura-border text-xs text-amoura-charcoal placeholder-amoura-muted focus:outline-none focus:border-amoura-forest"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3.5 px-6 rounded-xl font-semibold text-xs sm:text-sm bg-amoura-forest text-amoura-ivory hover:bg-amoura-charcoal flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-75"
                        >
                          <Sparkles className="w-4 h-4 text-amoura-terracotta" />
                          <span>{isSubmitting ? 'Saving Product...' : '✨ Add Product & Publish to Website'}</span>
                        </button>
                      </div>

                    </div>

                  </div>
                </form>
              </div>

              {/* Added Products List Card */}
              <div className="bg-white border border-amoura-border rounded-2xl p-5 sm:p-7 shadow-soft">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-amoura-border flex-wrap gap-2">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-amoura-charcoal flex items-center gap-2">
                      <Package className="w-5 h-5 text-amoura-forest" />
                      Your Added Products
                    </h2>
                    <p className="text-xs text-amoura-muted mt-0.5">
                      Products added via Admin. View, Edit, or Delete anytime.
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-amoura-cream text-amoura-forest border border-amoura-border px-3 py-1 rounded-full">
                    {products.length} {products.length === 1 ? 'Product' : 'Products'} Active
                  </span>
                </div>

                {loadingProducts ? (
                  <div className="py-12 text-center text-xs text-amoura-muted">Loading added products...</div>
                ) : products.length === 0 ? (
                  <div className="py-12 text-center text-xs text-amoura-muted space-y-2">
                    <Package className="w-10 h-10 mx-auto text-amoura-muted/50" />
                    <p className="font-medium text-amoura-charcoal">No custom products added yet.</p>
                    <p className="text-[11px]">Use the form above to add your first product.</p>
                  </div>
                ) : (
                  <div>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-xs text-amoura-charcoal">
                        <thead className="bg-amoura-ivory text-amoura-muted uppercase tracking-wider text-[10px] border-b border-amoura-border">
                          <tr>
                            <th className="py-3 px-4">Product</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Price</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amoura-border/60">
                          {products.map((p) => (
                            <tr key={p.id} className="hover:bg-amoura-ivory/50 transition-colors">
                              <td className="py-3.5 px-4 flex items-center gap-3">
                                <img
                                  src={p.img || '/images/logo.png'}
                                  alt={p.name}
                                  className="w-12 h-12 rounded-lg object-cover border border-amoura-border flex-shrink-0"
                                  onError={(e) => { e.target.onerror = null; e.target.src = '/image/Aurelia Bloom Royal Glden Floral Candle 320.jpg'; }}
                                />
                                <div className="min-w-0">
                                  <span className="font-bold block truncate max-w-xs">{p.name}</span>
                                  {p.tag && (
                                    <span className="text-[10px] text-amoura-forest bg-amoura-cream px-1.5 py-0.5 rounded border border-amoura-border">
                                      {p.tag}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 uppercase text-[11px] text-amoura-muted font-medium">
                                {p.category}
                              </td>
                              <td className="py-3.5 px-4 font-bold text-amoura-forest">
                                {formatINR(p.price)}
                                {p.mrp > p.price && (
                                  <span className="text-[10px] text-amoura-muted line-through block font-normal">
                                    {formatINR(p.mrp)}
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-amoura-muted text-[11px]">
                                {p.date || 'Recent'}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    onClick={() => setViewingProduct(p)}
                                    className="p-1.5 rounded-lg bg-amoura-cream border border-amoura-border text-amoura-charcoal hover:border-amoura-forest cursor-pointer"
                                    title="View Details"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-amoura-forest" />
                                  </button>
                                  <button
                                    onClick={() => openEditModal(p)}
                                    className="p-1.5 rounded-lg bg-amoura-forest text-amoura-ivory hover:bg-amoura-charcoal transition-colors cursor-pointer"
                                    title="Edit Product"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p)}
                                    className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile / Tablet Responsive Cards Layout */}
                    <div className="md:hidden space-y-4">
                      {products.map((p) => (
                        <div
                          key={p.id}
                          className="p-4 rounded-xl bg-amoura-ivory border border-amoura-border space-y-3 shadow-sm"
                        >
                          <div className="flex gap-3 items-center">
                            <img
                              src={p.img || '/images/logo.png'}
                              alt={p.name}
                              className="w-16 h-16 rounded-lg object-cover border border-amoura-border flex-shrink-0"
                              onError={(e) => { e.target.onerror = null; e.target.src = '/image/Aurelia Bloom Royal Glden Floral Candle 320.jpg'; }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-amoura-forest bg-amoura-cream px-1.5 py-0.5 rounded uppercase font-bold">
                                  {p.category}
                                </span>
                                {p.tag && (
                                  <span className="text-[10px] text-amoura-muted bg-white px-1.5 py-0.5 rounded border border-amoura-border">
                                    {p.tag}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-serif font-bold text-sm text-amoura-charcoal truncate mt-1">{p.name}</h4>
                              <div className="flex items-baseline gap-2 mt-0.5">
                                <span className="font-bold text-amoura-forest text-sm">{formatINR(p.price)}</span>
                                {p.mrp > p.price && (
                                  <span className="text-xs text-amoura-muted line-through">{formatINR(p.mrp)}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {p.desc && (
                            <p className="text-xs text-amoura-muted line-clamp-2 leading-relaxed">
                              {p.desc}
                            </p>
                          )}

                          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-amoura-border">
                            <button
                              onClick={() => setViewingProduct(p)}
                              className="py-2 px-2 rounded-lg bg-white border border-amoura-border text-amoura-charcoal text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-amoura-forest" />
                              <span>View</span>
                            </button>

                            <button
                              onClick={() => openEditModal(p)}
                              className="py-2 px-2 rounded-lg bg-amoura-forest text-amoura-ivory text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(p)}
                              className="py-2 px-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="bg-white border border-amoura-border rounded-2xl p-6 sm:p-8 shadow-soft space-y-6">
              <h2 className="font-serif text-2xl font-bold text-amoura-charcoal">Store Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-amoura-cream border border-amoura-border">
                  <span className="text-xs text-amoura-muted block">Catalog Products</span>
                  <span className="font-serif text-3xl font-bold text-amoura-forest mt-1 block">{33 + 5 + 4 + products.length}</span>
                  <span className="text-[11px] text-amoura-muted">Candles, Resin &amp; Plants</span>
                </div>
                <div className="p-4 rounded-xl bg-amoura-cream border border-amoura-border">
                  <span className="text-xs text-amoura-muted block">Custom Added Products</span>
                  <span className="font-serif text-3xl font-bold text-amoura-forest mt-1 block">{products.length}</span>
                  <span className="text-[11px] text-amoura-forest font-semibold">Active in Store</span>
                </div>
                <div className="p-4 rounded-xl bg-amoura-cream border border-amoura-border">
                  <span className="text-xs text-amoura-muted block">Free Delivery Threshold</span>
                  <span className="font-serif text-3xl font-bold text-amoura-forest mt-1 block">₹1,000</span>
                  <span className="text-[11px] text-amoura-muted">PAN-India Dispatch</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-amoura-border rounded-2xl p-6 sm:p-8 shadow-soft space-y-4">
              <h2 className="font-serif text-2xl font-bold text-amoura-charcoal">Order Dispatch Queue</h2>
              <p className="text-xs text-amoura-muted leading-relaxed">
                Orders placed on the website are dispatched directly to WhatsApp (+91 87006 89036) with customer delivery details, selected shades, itemized quantities, and transaction verification notes.
              </p>
              <div className="p-4 rounded-xl bg-amoura-ivory border border-amoura-border text-xs text-amoura-charcoal">
                <p className="font-semibold text-amoura-forest">Live Order Notification:</p>
                <p className="text-amoura-muted mt-1">Check your linked WhatsApp for instant order alerts and customer chat confirmations.</p>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="bg-white border border-amoura-border rounded-2xl p-6 sm:p-8 shadow-soft space-y-4">
              <h2 className="font-serif text-2xl font-bold text-amoura-charcoal">Customer Inquiries</h2>
              <p className="text-xs text-amoura-muted leading-relaxed">
                Bulk order inquiries, wedding favor customizations, and product questions are routed directly to your studio phone for immediate client consultation.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amoura-charcoal/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white border border-amoura-border rounded-2xl shadow-elevated overflow-hidden my-8">
            <div className="p-5 border-b border-amoura-border bg-amoura-cream flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amoura-forest" />
                <h3 className="font-serif text-xl font-bold text-amoura-charcoal">Edit Product</h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg text-amoura-muted hover:text-amoura-charcoal cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              <div className="flex items-center gap-4 p-3 rounded-xl bg-amoura-ivory border border-amoura-border">
                <img
                  src={editImagePreview || editingProduct.img || '/images/logo.png'}
                  alt="Edit Preview"
                  className="w-16 h-16 rounded-lg object-cover border border-amoura-border flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-semibold text-amoura-charcoal mb-1">
                    Change Product Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileChange(e, true)}
                    className="text-xs text-amoura-muted file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border file:border-amoura-border file:bg-white file:text-amoura-forest file:text-xs cursor-pointer"
                  />
                  <p className="text-[10px] text-amoura-muted mt-0.5">If unchanged, previous image is preserved.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-amoura-charcoal mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-ivory border border-amoura-border text-xs text-amoura-charcoal focus:outline-none focus:border-amoura-forest"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-amoura-charcoal mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-ivory border border-amoura-border text-xs text-amoura-charcoal focus:outline-none focus:border-amoura-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-amoura-charcoal mb-1">Original Price / MRP (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.mrp || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, mrp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-ivory border border-amoura-border text-xs text-amoura-charcoal focus:outline-none focus:border-amoura-forest"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-amoura-charcoal mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-ivory border border-amoura-border text-xs text-amoura-charcoal focus:outline-none focus:border-amoura-forest"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-amoura-charcoal mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={editingProduct.tag || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tag: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-ivory border border-amoura-border text-xs text-amoura-charcoal focus:outline-none focus:border-amoura-forest"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-amoura-charcoal mb-1">Short Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.desc || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, desc: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-amoura-ivory border border-amoura-border text-xs text-amoura-charcoal focus:outline-none focus:border-amoura-forest"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-amoura-forest text-amoura-ivory hover:bg-amoura-charcoal flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isUpdating ? 'Updating Product...' : 'Update Product & Save Changes'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="py-3 px-4 rounded-xl text-xs text-amoura-muted hover:text-amoura-charcoal bg-amoura-cream border border-amoura-border cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* View Product Details Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amoura-charcoal/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white border border-amoura-border rounded-2xl p-6 shadow-elevated space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-amoura-border">
              <h3 className="font-serif text-lg font-bold text-amoura-charcoal">Product Details</h3>
              <button onClick={() => setViewingProduct(null)} className="p-1 text-amoura-muted hover:text-amoura-charcoal cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-square w-full rounded-xl overflow-hidden border border-amoura-border bg-amoura-cream">
              <img
                src={viewingProduct.img || '/images/logo.png'}
                alt={viewingProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] text-amoura-forest bg-amoura-cream px-2 py-0.5 rounded uppercase font-bold">
                {viewingProduct.category}
              </span>
              <h4 className="font-serif text-xl font-bold text-amoura-charcoal">{viewingProduct.name}</h4>
              <p className="text-amoura-muted">{viewingProduct.desc}</p>
              <div className="flex items-baseline gap-2 pt-2 text-base font-bold text-amoura-forest">
                <span>{formatINR(viewingProduct.price)}</span>
                {viewingProduct.mrp > viewingProduct.price && (
                  <span className="text-xs text-amoura-muted line-through font-normal">
                    {formatINR(viewingProduct.mrp)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setViewingProduct(null)}
              className="w-full py-2.5 rounded-xl bg-amoura-cream border border-amoura-border text-xs font-semibold text-amoura-charcoal hover:border-amoura-forest cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amoura-charcoal/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white border border-amoura-border rounded-2xl p-6 shadow-elevated space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-amoura-border">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amoura-forest" />
                <h3 className="font-serif text-lg font-bold text-amoura-charcoal">Change Admin Password</h3>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1 text-amoura-muted hover:text-amoura-charcoal cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordStatus.text && (
              <div
                className={`p-3 rounded-xl text-xs font-medium ${
                  passwordStatus.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                    : 'bg-rose-50 border border-rose-300 text-rose-800'
                }`}
              >
                {passwordStatus.text}
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-amoura-charcoal mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-amoura-ivory border border-amoura-border text-xs text-amoura-charcoal focus:outline-none focus:border-amoura-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-amoura-charcoal mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={passwordForm.next}
                  onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-amoura-ivory border border-amoura-border text-xs text-amoura-charcoal focus:outline-none focus:border-amoura-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-amoura-charcoal mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Re-enter new password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-amoura-ivory border border-amoura-border text-xs text-amoura-charcoal focus:outline-none focus:border-amoura-forest"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs bg-amoura-forest text-amoura-ivory hover:bg-amoura-charcoal cursor-pointer disabled:opacity-75"
                >
                  {isChangingPass ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl text-xs text-amoura-muted bg-amoura-cream border border-amoura-border cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
