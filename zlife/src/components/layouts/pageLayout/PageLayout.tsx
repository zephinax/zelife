import React from "react";
import PageTransition from "../../pageTransition/PageTransition";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageTransition
        variant="slide"
        className="px-2 bg-background min-h-[100svh] w-screen"
      >
        {children}
      </PageTransition>
    </>
  );
}
