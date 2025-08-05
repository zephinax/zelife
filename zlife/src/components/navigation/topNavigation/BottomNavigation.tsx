import React from "react";
import { FaSackDollar } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { MdTask } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

type IconType = React.ComponentType<{ className?: string; size?: number }>;

export default function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const renderIcon = (Icon: IconType, isActive: boolean) => {
    const iconColor = isActive ? "text-primary" : "text-text-secondary";
    return <Icon size={22} className={`w-6 h-6 ${iconColor}`} />;
  };

  const routes = [
    {
      name: "Finance",
      icon: FaSackDollar,
      route: "/",
    },
    {
      name: "Tasks",
      icon: MdTask,
      route: "/tasks",
    },
    {
      name: "Setting",
      icon: IoMdSettings,
      route: "/setting",
    },
  ];

  return (
    <div className="fixed bottom-0 h-[60px] w-full gap-4 bg-background-secondary items-center flex justify-evenly">
      {routes.map((item) => {
        const isActive = location.pathname === item.route;
        return (
          <div
            key={item.name}
            className="flex flex-col items-center justify-center cursor-pointer"
            onClick={() => navigate(item.route)}
          >
            {renderIcon(item.icon, isActive)}
            <span
              className={`text-[11px] ${
                isActive ? "text-primary" : "text-text-secondary"
              }`}
            >
              {item.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
