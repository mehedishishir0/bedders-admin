import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center lg:justify-left"
    >
      {children}
    </div>
  );
};

export default Layout;