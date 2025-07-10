import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Main from "./Main";

export default function Layout({ children }) {
  return (
    <div className="app-wrapper">
      <Header />
      <Sidebar />
      <Main>{children}</Main>
      <Footer />
    </div>
  );
}
