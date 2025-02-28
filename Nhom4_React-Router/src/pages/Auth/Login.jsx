import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useState ,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as React from "react";
import { AuthContext } from "../../config/AuthContext";

const initialState = {
  email: "",
  password: "",
};

const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { setIsLoggedIn } = useContext(AuthContext);
  function onSubmit(e) {
    e.preventDefault();
   
    if (formData.email === "user@gmail.com" && formData.password === "123") {
      setIsLoggedIn(true);
      navigate("/");
    } else {
      setError("Invalid email or password"); 
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h1>
          <p className="mt-2">
            Do not have an account?{" "}
            <Link
              to="/auth/register"
              className="font-medium text-blue-600 text-primary"
            >
              Register
            </Link>
          </p>
        </div>
        <div className="p-4 mt-6 space-y-2 rounded-md bg-neutral-50">
          <div className="">
            <h6 className="text-sm font-medium">User Account</h6>
            <table className="text-sm">
              <tr className="w-full">
                <td className="opacity-90">email</td>
                <td>:</td>
                <td>user@gmail.com</td>
              </tr>
              <tr className="w-full">
                <td className="opacity-90">password</td>
                <td>:</td>
                <td>123</td>
              </tr>
            </table>
          </div>
        </div>

        {error && <div className="text-red-500 text-center">{error}</div>}

        <CommonForm
          formControls={loginFormControls}
          buttonText={"Sign In"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default AuthLogin;