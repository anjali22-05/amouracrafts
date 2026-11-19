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
  Camera
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

  // Check auth
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Load custom added products
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

  // Image Upload with Auto Canvas Compression
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

  // Add Product Handler
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

  // Open Edit Modal
  const openEditModal = (p) => {
    setEditingProduct({ ...p });
    setEditImagePreview(p.img);
  };

  // Update Product Handler
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

  // Delete Product Handler
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

  // Change Password Handler
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
        <p className="text-amoura-gold text-sm animate-pulse">Loading Admin Portal...</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Header Bar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-amoura-card border border-amoura-line flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-amoura-gold/10 border border-amoura-gold/30 flex items-center justify-center text-amoura-gold">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-amoura-gold font-bold block">
              Admin Portal
            </span>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-amoura-cream">
              Manage Products &amp; Store Catalog
            </h1>
          </div>
        </div>

        {/* Quick Nav & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amoura-bg border border-amoura-line text-amoura-cream hover:text-amoura-gold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amoura-gold" />
            <span>View Live Site</span>
          </Link>

          <button
            onClick={() => {
              setIsPasswordModalOpen(true);
              setPasswordStatus({ type: '', text: '' });
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amoura-bg border border-amoura-line text-amoura-cream hover:text-amoura-gold transition-colors"
          >
            <Key className="w-3.5 h-3.5 text-amoura-gold" />
            <span>Change Password</span>
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-950/60 border border-rose-500/30 text-rose-200 hover:bg-rose-900 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Status Alert Notification */}
      {statusMessage.text && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/80 border border-rose-500/50 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage({ type: '', text: '' })}
            className="p-1 hover:opacity-75"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Add Product Card */}
      <div className="bg-amoura-card border border-amoura-line rounded-2xl p-5 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-amoura-line">
          <PlusCircle className="w-5 h-5 text-amoura-gold" />
          <h2 className="font-display text-lg sm:text-xl font-bold text-amoura-cream">
            Add New Product
          </h2>
          <span className="text-[11px] text-amoura-muted ml-auto hidden sm:block">
            Auto-syncs to category page instantly
          </span>
        </div>

        <form onSubmit={handleAddProduct} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Image Upload Area (4 cols on lg) */}
            <div className="lg:col-span-4 space-y-3">
              <label className="block text-xs font-semibold text-amoura-cream">
                Product Image *
              </label>

              <div className="relative aspect-square w-full rounded-2xl border-2 border-dashed border-amoura-line hover:border-amoura-gold/70 bg-amoura-bg/80 flex flex-col items-center justify-center p-4 text-center cursor-pointer overflow-hidden transition-colors group">
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
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs text-white gap-1.5 font-medium">
                      <Camera className="w-4 h-4" /> Change Image
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-amoura-muted">
                    <div className="w-12 h-12 rounded-full bg-amoura-card border border-amoura-line flex items-center justify-center mx-auto text-amoura-gold">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-amoura-cream">Click or drag image here</p>
                      <p className="text-[10px] text-amoura-muted mt-0.5">Auto-optimizes to high-performance WebP</p>
                    </div>
                  </div>
                )}
              </div>

              {imagePreview && (
                <button
                  type="button"
                  onClick={() => { setImagePreview(''); setNewProduct(prev => ({ ...prev, img: '' })); }}
                  className="text-[11px] text-rose-400 hover:underline block text-center w-full"
                >
                  Remove Selected Image
                </button>
              )}
            </div>

            {/* Product Details Form (8 cols on lg) */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Product Name */}
              <div>
                <label className="block text-xs font-medium text-amoura-cream mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Urli Scented Candle"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream placeholder-amoura-muted focus:outline-none focus:border-amoura-gold"
                />
              </div>

              {/* Price & MRP Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-amoura-cream mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="e.g. 550"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream placeholder-amoura-muted focus:outline-none focus:border-amoura-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-amoura-cream mb-1">
                    Original Price / MRP (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="e.g. 699 (Optional strike-through)"
                    value={newProduct.mrp}
                    onChange={(e) => setNewProduct({ ...newProduct, mrp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream placeholder-amoura-muted focus:outline-none focus:border-amoura-gold"
                  />
                </div>
              </div>

              {/* Category & Badge Tag Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-amoura-cream mb-1">
                    Category *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream focus:outline-none focus:border-amoura-gold"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id} className="bg-amoura-dark">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-amoura-cream mb-1">
                    Badge Tag (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bestseller, New Arrival, Festive Special"
                    value={newProduct.tag}
                    onChange={(e) => setNewProduct({ ...newProduct, tag: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream placeholder-amoura-muted focus:outline-none focus:border-amoura-gold"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-medium text-amoura-cream mb-1">
                  Short Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Handcrafted pure soy wax creation with dried botanicals. Perfect for home decor and festive gifting."
                  value={newProduct.desc}
                  onChange={(e) => setNewProduct({ ...newProduct, desc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream placeholder-amoura-muted focus:outline-none focus:border-amoura-gold"
                />
              </div>

              {/* Add Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-amoura-gold via-amoura-gold-light to-amoura-gold-dark text-amoura-dark hover:shadow-gold-glow flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving Product...' : '✨ Add Product & Publish to Website'}</span>
                </button>
              </div>

            </div>

          </div>
        </form>
      </div>

      {/* Your Added Products List Section */}
      <div className="bg-amoura-card border border-amoura-line rounded-2xl p-5 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-amoura-line flex-wrap gap-2">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-amoura-cream flex items-center gap-2">
              <Package className="w-5 h-5 text-amoura-gold" />
              Your Added Products
            </h2>
            <p className="text-xs text-amoura-muted mt-0.5">
              Custom products added via the Admin Panel. View, Edit, or Delete anytime.
            </p>
          </div>
          <span className="text-xs font-bold bg-amoura-gold/10 text-amoura-gold border border-amoura-gold/30 px-3 py-1 rounded-full">
            {products.length} {products.length === 1 ? 'Product' : 'Products'} Added
          </span>
        </div>

        {loadingProducts ? (
          <div className="py-12 text-center text-xs text-amoura-muted">Loading added products...</div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center text-xs text-amoura-muted space-y-2">
            <Package className="w-10 h-10 mx-auto text-amoura-muted/50" />
            <p className="font-medium text-amoura-subtext">No custom products added yet.</p>
            <p className="text-[11px]">Use the form above to add your first product with an image and price.</p>
          </div>
        ) : (
          <div>
            {/* Desktop Table View (Hidden on mobile/tablet) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-amoura-cream">
                <thead className="bg-amoura-bg text-amoura-muted uppercase tracking-wider text-[10px] border-b border-amoura-line">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amoura-line/40">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-amoura-bg/50 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <img
                          src={p.img || '/images/logo.png'}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover border border-amoura-line flex-shrink-0"
                          onError={(e) => { e.target.onerror = null; e.target.src = '/image/Aurelia Bloom Royal Glden Floral Candle 320.jpg'; }}
                        />
                        <div className="min-w-0">
                          <span className="font-bold block truncate max-w-xs">{p.name}</span>
                          {p.tag && (
                            <span className="text-[10px] text-amoura-gold bg-amoura-gold/10 px-1.5 py-0.2 rounded border border-amoura-gold/20">
                              {p.tag}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 uppercase text-[11px] text-amoura-subtext">
                        {p.category}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amoura-gold">
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
                            className="p-1.5 rounded-lg bg-amoura-bg border border-amoura-line text-amoura-cream hover:text-amoura-gold"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg bg-amoura-bg border border-amoura-line text-amoura-gold hover:bg-amoura-gold hover:text-amoura-bg transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:bg-rose-900 transition-colors"
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
                  className="p-4 rounded-xl bg-amoura-bg border border-amoura-line space-y-3 shadow-md"
                >
                  <div className="flex gap-3 items-center">
                    <img
                      src={p.img || '/images/logo.png'}
                      alt={p.name}
                      className="w-16 h-16 rounded-lg object-cover border border-amoura-line flex-shrink-0"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/image/Aurelia Bloom Royal Glden Floral Candle 320.jpg'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-amoura-gold bg-amoura-gold/10 px-1.5 py-0.5 rounded uppercase font-bold">
                          {p.category}
                        </span>
                        {p.tag && (
                          <span className="text-[10px] text-amoura-cream-dim bg-amoura-card px-1.5 py-0.5 rounded border border-amoura-line">
                            {p.tag}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-amoura-cream truncate mt-1">{p.name}</h4>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-bold text-amoura-gold text-sm">{formatINR(p.price)}</span>
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

                  {/* Actions for Mobile */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-amoura-line/60">
                    <button
                      onClick={() => setViewingProduct(p)}
                      className="py-2 px-2 rounded-lg bg-amoura-card border border-amoura-line text-amoura-cream text-xs font-semibold flex items-center justify-center gap-1 hover:text-amoura-gold"
                    >
                      <Eye className="w-3.5 h-3.5 text-amoura-gold" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => openEditModal(p)}
                      className="py-2 px-2 rounded-lg bg-amoura-gold/15 border border-amoura-gold/40 text-amoura-gold text-xs font-semibold flex items-center justify-center gap-1 hover:bg-amoura-gold hover:text-amoura-bg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(p)}
                      className="py-2 px-2 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1 hover:bg-rose-900 transition-colors"
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

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-xl bg-amoura-card border border-amoura-line rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="p-5 border-b border-amoura-line bg-amoura-bg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amoura-gold" />
                <h3 className="font-display text-lg font-bold text-amoura-cream">Edit Product</h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg text-amoura-muted hover:text-amoura-cream"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Image Preview & Change */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-amoura-bg border border-amoura-line">
                <img
                  src={editImagePreview || editingProduct.img || '/images/logo.png'}
                  alt="Edit Preview"
                  className="w-16 h-16 rounded-lg object-cover border border-amoura-line flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-semibold text-amoura-cream mb-1">
                    Change Product Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileChange(e, true)}
                    className="text-xs text-amoura-muted file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border file:border-amoura-line file:bg-amoura-card file:text-amoura-gold file:text-xs cursor-pointer"
                  />
                  <p className="text-[10px] text-amoura-muted mt-0.5">If unchanged, previous image is preserved.</p>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-xs font-medium text-amoura-cream mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream focus:outline-none focus:border-amoura-gold"
                />
              </div>

              {/* Price & MRP */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-amoura-cream mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream focus:outline-none focus:border-amoura-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-amoura-cream mb-1">Original Price / MRP (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.mrp || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, mrp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream focus:outline-none focus:border-amoura-gold"
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-amoura-cream mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream focus:outline-none focus:border-amoura-gold"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id} className="bg-amoura-dark">{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-amoura-cream mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={editingProduct.tag || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tag: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream focus:outline-none focus:border-amoura-gold"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-amoura-cream mb-1">Short Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.desc || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, desc: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream focus:outline-none focus:border-amoura-gold"
                />
              </div>

              {/* Update Submit */}
              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-amoura-gold via-amoura-gold-light to-amoura-gold-dark text-amoura-dark hover:shadow-gold-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isUpdating ? 'Updating Product...' : 'Update Product & Save Changes'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="py-3 px-4 rounded-xl text-xs text-amoura-muted hover:text-amoura-cream bg-amoura-bg border border-amoura-line"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-amoura-card border border-amoura-line rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-amoura-line">
              <h3 className="font-display text-base font-bold text-amoura-cream">Product Details</h3>
              <button onClick={() => setViewingProduct(null)} className="p-1 text-amoura-muted hover:text-amoura-cream">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-square w-full rounded-xl overflow-hidden border border-amoura-line bg-amoura-dark">
              <img
                src={viewingProduct.img || '/images/logo.png'}
                alt={viewingProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] text-amoura-gold bg-amoura-gold/10 px-2 py-0.5 rounded uppercase font-bold">
                {viewingProduct.category}
              </span>
              <h4 className="font-display text-lg font-bold text-amoura-cream">{viewingProduct.name}</h4>
              <p className="text-amoura-muted">{viewingProduct.desc}</p>
              <div className="flex items-baseline gap-2 pt-2 text-base font-bold text-amoura-gold">
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
              className="w-full py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs font-semibold text-amoura-cream hover:text-amoura-gold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-amoura-card border border-amoura-line rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-amoura-line">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amoura-gold" />
                <h3 className="font-display text-base font-bold text-amoura-cream">Change Admin Password</h3>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1 text-amoura-muted hover:text-amoura-cream"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordStatus.text && (
              <div
                className={`p-3 rounded-xl text-xs font-medium ${
                  passwordStatus.type === 'success'
                    ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/80 border border-rose-500/50 text-rose-200'
                }`}
              >
                {passwordStatus.text}
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-amoura-cream mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream focus:outline-none focus:border-amoura-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-amoura-cream mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={passwordForm.next}
                  onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream focus:outline-none focus:border-amoura-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-amoura-cream mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Re-enter new password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream focus:outline-none focus:border-amoura-gold"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs bg-gradient-to-r from-amoura-gold via-amoura-gold-light to-amoura-gold-dark text-amoura-dark hover:shadow-gold-glow cursor-pointer disabled:opacity-75"
                >
                  {isChangingPass ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl text-xs text-amoura-muted bg-amoura-bg border border-amoura-line"
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
