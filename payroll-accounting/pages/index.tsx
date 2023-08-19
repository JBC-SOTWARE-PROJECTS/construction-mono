import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import { IPageProps } from "@/utility/interfaces";

const MainMenu = asyncComponent(() => import("../routes/menu/main"));

export default function index({ account }: IPageProps) {
  return <MainMenu account={account} />;
}
