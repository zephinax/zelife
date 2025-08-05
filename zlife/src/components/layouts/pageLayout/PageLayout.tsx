import BottomNavigation from "../../navigation/topNavigation/BottomNavigation";
import React from "react";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="p-4 bg-background min-h-[100svh] w-screen">
        {children}
      </div>
      <BottomNavigation />
    </>
  );
}
