import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext/index";
// import {authApi} from "../../service/api";

const initialState = {
  name: "",
  email: "",
  password: "",
};

const AuthRegister = () => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const {register} = useAuth();
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await register( formData.name, formData.email, formData.password);
      console.log('Registration successful:', user);
      
      // Tự động đăng nhập sau khi đăng ký hoặc chuyển hướng đến trang đăng nhập
      navigate("/auth/login");
      
      // Hoặc có thể đăng nhập luôn:
      // const loginUser = await authApi.login(formData.email, formData.password);
      // console.log('Auto-login successful:', loginUser);
      // navigate('/');
      
    } catch (err) {
      setError(err.message || 'Registration failed');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create New Account
        </h1>
        <p className="mt-2">
          Already have an account ?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-blue-600 text-primary"
          >
            Login
          </Link>
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <CommonForm
        formControls={registerFormControls}
        buttonText={loading ? "Creating Account..." : "Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        disabled={loading}
      />
    </div>
  );
};

export default AuthRegister;