import { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'react-toastify';

const API_BASE = 'http://localhost:5000';

const UserFormModal = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleNames: ['user'],
    isActive: true
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        roleNames: user.roles.map(r => r.name),
        isActive: user.isActive !== false
      });
    }
  }, [user]);

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('access-token');
      const response = await axios.get(`${API_BASE}/admin/roles`, {
        headers: { 'x-access-token': token }
      });
      setRoles(response.data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleToggle = (roleName) => {
    setFormData(prev => {
      const roleNames = prev.roleNames.includes(roleName)
        ? prev.roleNames.filter(r => r !== roleName)
        : [...prev.roleNames, roleName];
      
      // Ensure at least one role is selected
      return {
        ...prev,
        roleNames: roleNames.length > 0 ? roleNames : ['user']
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!user && !formData.password) {
      toast.error('Vui lòng nhập mật khẩu');
      return;
    }

    if (formData.roleNames.length === 0) {
      toast.error('Vui lòng chọn ít nhất một vai trò');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('access-token');
      const url = user
        ? `${API_BASE}/admin/users/${user._id}`
        : `${API_BASE}/admin/users`;
      
      const method = user ? 'put' : 'post';
      
      const payload = {
        name: formData.name,
        email: formData.email,
        roleNames: formData.roleNames,
        isActive: formData.isActive
      };

      // Only include password if it's provided
      if (formData.password) {
        payload.password = formData.password;
      }

      await axios[method](url, payload, {
        headers: { 'x-access-token': token }
      });

      toast.success(user ? 'Cập nhật người dùng thành công' : 'Thêm người dùng thành công');
      onClose(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </h2>
          <button onClick={() => onClose(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tên *</label>
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
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Mật khẩu {user ? '(để trống nếu không đổi)' : '*'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required={!user}
              minLength={6}
              placeholder={user ? 'Nhập mật khẩu mới nếu muốn đổi' : 'Tối thiểu 6 ký tự'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Vai trò *</label>
            <div className="space-y-2">
              {roles.map((role) => (
                <label key={role._id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.roleNames.includes(role.name)}
                    onCheckedChange={() => handleRoleToggle(role.name)}
                  />
                  <span className="text-sm capitalize">{role.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <label className="text-sm font-medium">Tài khoản hoạt động</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : user ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
