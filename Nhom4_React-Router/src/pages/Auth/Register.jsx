import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as React from "react";

const initialState = {
    userName: "",
    email: "",
    password: "",
  };

const AuthRegister = () => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  function onSubmit(e) {
    
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
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
        

        {error && <div className="text-red-500 text-center">{error}</div>}

        <CommonForm
          formControls={registerFormControls}
          buttonText={"Sign Up"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default AuthRegister;