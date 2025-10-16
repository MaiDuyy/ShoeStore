import { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

const API_BASE = 'http://localhost:5000';

const ProductFormModal = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    gender: 'unisex',
    category: '',
    price: '',
    items_left: '',
    imageURL: '',
    slug: '',
    featured: 0,
    is_in_inventory: true,
    attributes: {
      sizes: [],
      colors: [],
      features: []
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        attributes: product.attributes || { sizes: [], colors: [], features: [] }
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

const handleArrayChange = (key, value) => {
  const array = value.split(',').map(item => item.trim());
  setFormData(prev => ({
    ...prev,
    attributes: {
      ...prev.attributes,
      [key]: array,
      [`${key}Raw`]: value
    }
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access-token');
      const url = product
        ? `${API_BASE}/admin/products/${product._id}`
        : `${API_BASE}/admin/products`;
      
      const method = product ? 'put' : 'post';

      await axios[method](url, formData, {
        headers: { 'x-access-token': token }
      });

      toast.success(product ? 'Cập nhật sản phẩm thành công' : 'Thêm sản phẩm thành công');
      onClose(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h2>
          <button onClick={() => onClose(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tên sản phẩm *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Thương hiệu *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Danh mục *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Giới tính</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="unisex">Unisex</option>
                <option value="men">Nam</option>
                <option value="women">Nữ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Giá *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Số lượng *</label>
              <input
                type="number"
                name="items_left"
                value={formData.items_left}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Featured (0-10)</label>
              <input
                type="number"
                name="featured"
                value={formData.featured}
                onChange={handleChange}
                min="0"
                max="10"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">URL hình ảnh *</label>
            <input
              type="url"
              name="imageURL"
              value={formData.imageURL}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sizes (phân cách bằng dấu phẩy)</label>
            <input
              type="text"
              value={formData.attributes.sizes.join(', ')}
              onChange={(e) => handleArrayChange('sizes', e.target.value)}
              placeholder="S, M, L, XL"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Colors (phân cách bằng dấu phẩy)</label>
            <input
              type="text"
              value={formData.attributes.colors.join(', ')}
              onChange={(e) => handleArrayChange('colors', e.target.value)}
              placeholder="red, blue, black"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_in_inventory"
              checked={formData.is_in_inventory}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label className="text-sm font-medium">Còn hàng</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : product ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
