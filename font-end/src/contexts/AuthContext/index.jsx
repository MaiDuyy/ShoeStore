import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { toast } from "sonner";
import { authApi } from "../../service/api";

/** ====== Config ====== */
const ACCESS_TOKEN_KEY = "accessToken";
const USER_CACHE_KEY = "auth_user";
const API_BASE_URL = "http://localhost:5000";

/** Corbado tutorial dùng /api/test/* để verify token */
const VERIFY_USER_URL = `${API_BASE_URL}/api/test/user`;
// Nếu bạn chưa có route này, refreshMe sẽ fallback sang cached user

/** ====== Helpers ====== */
const setAuthHeader = (token) => {
  if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete axios.defaults.headers.common.Authorization;
};

const normalizeRoles = (roles) =>
  Array.isArray(roles) ? roles : roles ? [roles] : [];

const hasAnyRole = (userRoles = [], required = []) => {
  if (!required?.length) return true;
  const set = new Set(userRoles.map((r) => String(r).toUpperCase()));
  return required.some((r) => set.has(String(r).toUpperCase()));
};

const readCachedUser = () => {
  try {
    const cached = localStorage.getItem(USER_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

/** Map dữ liệu user từ login response (shape bạn gửi) */
const buildUserFromLogin = (data) => {
  if (!data || typeof data !== "object") return null;
  const id = data.id ?? data._id ?? null;
  const email = data.email ?? "";
  const username =
    data.name || (email ? email.split("@")[0] : "") || "user";
  const roles = normalizeRoles(data.roles);
  if (!id && !email && !username) return null;
  return { id, email, username, roles };
};

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  roles: [],
  login: async (_usernameOrEmail, _password) => {},
  register: async (_name, _email, _password) => {},
  logout: async () => {},
  refreshMe: async () => {},
  setUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readCachedUser());
  const [isLoading, setIsLoading] = useState(true);
  const roles = useMemo(() => normalizeRoles(user?.roles), [user]);
  const isAuthenticated = !!user;

  /** Khởi động: gắn token và verify (nếu có endpoint), fallback cached */
  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) setAuthHeader(token);
    refreshMe().finally(() => setIsLoading(false));
  }, []); // eslint-disable-line

  /** Verify token theo flow Corbado. Không xoá token nếu 404 (endpoint chưa có). */
  const refreshMe = useCallback(async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const cached = readCachedUser();

    if (!token) {
      setAuthHeader(null);
      setUser(null);
      return null;
    }
    setAuthHeader(token);

    try {
      // Thử verify qua /api/test/user
      await axios.get(VERIFY_USER_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Token hợp lệ -> giữ cached user
      if (cached) {
        setUser(cached);
        return cached;
      }
      // Không có cached thì tối thiểu dựng user từ token (bỏ qua để đơn giản)
      return null;
    } catch (err) {
      const status = err?.response?.status;
      // 404: endpoint chưa triển khai -> giữ cached user & token
      if (status === 404) {
        if (cached) {
          setUser(cached);
          return cached;
        }
        return null;
      }
      // 401/403: token hết hạn/sai -> clear
      if (status === 401 || status === 403) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(USER_CACHE_KEY);
        setAuthHeader(null);
        setUser(null);
        return null;
      }
      // lỗi khác (network…) -> giữ nguyên cached, không xoá token
      if (cached) setUser(cached);
      return cached;
    }
  }, []);

  /** Login theo log của bạn: { id, email, roles, accessToken } */
  const login = useCallback(async (usernameOrEmail, password) => {
    try {
      const data = await authApi.login(usernameOrEmail, password);
      // Lấy token theo đúng key "accessToken"
      const token =
        data?.accessToken ||
        data?.token ||
        data?.access_token ||
        data?.jwt;

      if (!token) throw new Error("No access token in response");

      localStorage.setItem(ACCESS_TOKEN_KEY, token);
      setAuthHeader(token);

      // Dựng user từ response login
      const nextUser = buildUserFromLogin(data) || readCachedUser();
      if (nextUser) {
        localStorage.setItem(USER_CACHE_KEY, JSON.stringify(nextUser));
        setUser(nextUser);
      }

      toast.success(`Welcome ${nextUser?.name || nextUser?.email || ""}`);
      return nextUser;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Login failed";
      toast.error(message);
      throw new Error(message);
    }
  }, []);

  /** Register (server của bạn có thể auto-login hoặc không) */
  const register = useCallback(async (nameOrUsername, email, password) => {
    try {
      const data = await authApi.register(nameOrUsername, email, password);
      toast.success(data?.message || "Registration successful");
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed";
      toast.error(message);
      throw new Error(message);
    }
  }, []);

  /** Logout: không cần gọi server; chỉ xoá local */
  const logout = useCallback(async () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_CACHE_KEY);
    setAuthHeader(null);
    setUser(null);
    toast.success("Logged out");
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      roles,
      login,
      register,
      logout,
      refreshMe,
      setUser,
    }),
    [user, isAuthenticated, isLoading, roles, login, register, logout, refreshMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

/** ProtectedRoute như cũ */
export const ProtectedRoute = ({
  roles: requiredRoles = [],
  fallback = "/auth/login",
  children,
}) => {
  const { isAuthenticated, isLoading, roles } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoading) setReady(true);
  }, [isLoading]);

  if (!ready) return <div className="py-10 text-center">Loading...</div>;

  if (!isAuthenticated) {
    const { Navigate } = require("react-router-dom");
    return <Navigate to={fallback} replace />;
  }
  if (!hasAnyRole(roles, requiredRoles)) {
    const { Navigate } = require("react-router-dom");
    return <Navigate to="/" replace />;
  }
  return children;
};
