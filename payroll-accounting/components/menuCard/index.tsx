import { TDiverseTradeMenu } from "@/utility/interfaces";
import { useRouter } from "next/router";
import React from "react";

interface IProps {
  menus: TDiverseTradeMenu[];
}

export default function MenuCard({ menus }: IProps) {
  const router = useRouter();
  return (
    <div className="menu-container">
      {(menus || []).map((menu: TDiverseTradeMenu, index: number) => {
        return (
          <div
            className="menu-item-container cursor-pointer"
            key={index}
            onClick={() => router.push(menu.path ?? "/")}
          >
            <div className="menu-icon">{menu.icon}</div>
            <div className="menu-item-left-container">
              <p className="menu-item-title">{menu.title}</p>
              <p className="menu-item-description">{menu.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
