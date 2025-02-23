import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
// import { useToast } from "@/hooks/use-toast";
// import { loginUserThunk } from "@/store/auth-slice";
import { useState } from "react";
// import { useDispatch } from "react-redux";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import * as React from "react"




const initialState = {
  email: "",
  password: "",
};

const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  //   const dispath = useDispatch();
  //   const { toast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  axios.defaults.withCredentials = true;
  function onSubmit(e) {
    e.preventDefault();
    axios.post('http://localhost:5000/auth/userlogin', formData)
      .then(result => {
        if (result.data.loginStatus) {
          navigate('/')
        }else{
          setError(result.data.Error)
        }

      })
      .catch(err => console.log(err))
  }

  return (
    <div className="w-full max-w-md mx-auto ">
      <div className="space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h1>
          <p className="mt-2">
            Do not have an account ?{" "}
            <Link
              to="/auth/register"
              className="font-medium text-blue-600 text-primary"
            >
              Register
            </Link>
          </p>
        </div>
        <div className="p-4 mt-6 space-y-2 rounded-md bg-neutral-50">
          <h3 className="font-medium text-md">Instruksi Demo</h3>
          <p className="text-xs text-neutral-700">
            Ini adalah project demo, silahkan gunakan akun berikut untuk login
            atau register akun anda sendiri. Untuk register anda bisa
            menggunakan email palsu atau yang sejenisnya.
          </p>
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
                <td>user</td>
              </tr>
            </table>
          </div>
        </div>

        <div className="text-danger">
          {error && error}
        </div>


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