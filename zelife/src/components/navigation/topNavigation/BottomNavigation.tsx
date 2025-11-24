import React from "react";
import { FaSackDollar } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { MdTask } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "../../../hooks/useTranslation";

type IconType = React.ComponentType<{ className?: string; size?: number }>;

// تابع تشخیص iOS
const isIOS = () => {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
  );
};

export default function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const renderIcon = (Icon: IconType, isActive: boolean) => {
    const iconColor = isActive ? "text-primary" : "text-text-secondary";
    return <Icon size={22} className={`w-6 h-6 ${iconColor}`} />;
  };

  const routes = [
    {
      name: `${t("navbar.finance")}`,
      icon: FaSackDollar,
      route: "/",
    },
    {
      name: `${t("navbar.tasks")}`,
      icon: MdTask,
      route: "/tasks",
    },
    {
      name: `${t("navbar.setting")}`,
      icon: IoMdSettings,
      route: "/setting",
    },
  ];

  return (
    <div className="p-2 fixed w-full bottom-0">
      <div
        dir="ltr"
        className={`h-[68px] py-5 w-full max-w-5xl mx-auto gap-4 border-background border-[1px] bg-background-secondary/50 backdrop-blur-xl items-center flex justify-evenly
    shadow-[0_-8px_20px_rgba(0,0,0,0.05)]
    ${isIOS() ? "pb-[26px] h-[70px] rounded-[36px]" : "rounded-3xl"}`}
      >
        {routes.map((item) => {
          const isActive = location.pathname === item.route;
          return (
            <div
              key={item.name}
              className="flex min-w-[50px] flex-col items-center justify-center cursor-pointer"
              onClick={() => navigate(item.route)}
            >
              {renderIcon(item.icon, isActive)}
              <span
                className={`text-[11px] max-w-[60px] ${
                  isActive ? "text-primary" : "text-text-secondary"
                }`}
              >
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
