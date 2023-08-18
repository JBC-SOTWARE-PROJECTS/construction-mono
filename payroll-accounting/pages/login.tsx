import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const SignIn = asyncComponent(() => import("../routes/auth/signin"));

const SignInPage = () => {
  return <SignIn />;
};

export default SignInPage;
