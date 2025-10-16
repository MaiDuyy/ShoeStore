import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { User, Mail, Lock, Phone, MapPin, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

const API_BASE = 'http://localhost:5000';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatarURL: '',
    address: {
      street: '',
      city: '',
      district: '',
      ward: '',
      postalCode: ''
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access-token');
      const response = await axios.get(`${API_BASE}/user/profile`, {
        headers: { 'x-access-token': token }
      });
      setProfile(response.data);
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        avatarURL: response.data.avatarURL || '',
        address: response.data.address || {
          street: '',
          city: '',
          district: '',
          ward: '',
          postalCode: ''
        }
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Không thể tải thông tin profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('access-token');
      const response = await axios.put(
        `${API_BASE}/user/profile`,
        formData,
        { headers: { 'x-access-token': token } }
      );
      
      setProfile(response.data);
      setUser(response.data);
      setEditing(false);
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể cập nhật thông tin');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      const token = localStorage.getItem('access-token');
      await axios.put(
        `${API_BASE}/user/profile`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { headers: { 'x-access-token': token } }
      );
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setChangingPassword(false);
      toast.success('Đổi mật khẩu thành công');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể đổi mật khẩu');
    }
  };

  const handleAvatarUpdate = async (url) => {
    try {
      const token = localStorage.getItem('access-token');
      const response = await axios.put(
        `${API_BASE}/user/profile/avatar`,
        { avatarURL: url },
        { headers: { 'x-access-token': token } }
      );
      
      setProfile(response.data);
      setUser(response.data);
      setFormData(prev => ({ ...prev, avatarURL: url }));
      toast.success('Cập nhật ảnh đại diện thành công');
    } catch (error) {
      toast.error('Không thể cập nhật ảnh đại diện');
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Đang tải...</div>;
  }

  const getRoleNames = (roles) => {
    return roles?.map(r => r.name).join(', ') || 'user';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Thông tin cá nhân</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {formData.avatarURL ? (
                    <img src={formData.avatarURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <button
                  onClick={() => {
                    const url = prompt('Nhập URL ảnh đại diện:');
                    if (url) handleAvatarUpdate(url);
                  }}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <h2 className="mt-4 text-xl font-bold">{profile?.name}</h2>
              <p className="text-gray-600">{profile?.email}</p>
              <span className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {getRoleNames(profile?.roles)}
              </span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Thông tin cơ bản</h3>
              {!editing && (
                <Button onClick={() => setEditing(true)} variant="outline">
                  Chỉnh sửa
                </Button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Tên
                  </label>
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
                  <label className="block text-sm font-medium mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
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
                    <Phone className="w-4 h-4 inline mr-2" />
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit">Lưu thay đổi</Button>
                  <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                    Hủy
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Tên</p>
                    <p className="font-medium">{profile?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{profile?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại</p>
                    <p className="font-medium">{profile?.phone || 'Chưa cập nhật'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Password Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Đổi mật khẩu</h3>
              {!changingPassword && (
                <Button onClick={() => setChangingPassword(true)} variant="outline">
                  Đổi mật khẩu
                </Button>
              )}
            </div>

            {changingPassword ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full border rounded-lg px-4 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full border rounded-lg px-4 py-2"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full border rounded-lg px-4 py-2"
                    required
                    minLength={6}
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit">Đổi mật khẩu</Button>
                  <Button type="button" variant="outline" onClick={() => setChangingPassword(false)}>
                    Hủy
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-gray-600">••••••••</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
