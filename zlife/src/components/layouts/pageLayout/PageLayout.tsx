import React from "react";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="px-2 bg-background min-h-[100svh] w-screen">
        {children}
      </div>
    </>
  );
}
