import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
// import { registerUserThunk } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// import { useToast } from "@/hooks/use-toast";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

const AuthRegister = () => {
  const [formData, setFormData] = useState(initialState);
//   const dispacth = useDispatch();
//   const navigate = useNavigate();
//   const { toast } = useToast();

  function onSubmit(e) {
    // e.preventDefault();
    // dispacth(registerUserThunk(formData)).then((data) => {
    //   if (data?.payload?.success) {
    //     toast({
    //       title: data?.payload?.message,
    //     });
    //     navigate("/auth/login");
    //   } else {
    //     toast({
    //       title: data?.payload?.message,
    //       variant: "destructive",
    //     });
    //   }
    // });
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
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default AuthRegister;