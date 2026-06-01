import { Outlet, useLocation } from "react-router-dom";
import Navigation from "../components/Nav";
import Footer from "../components/footer";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import ChatWidget from "../components/ChatWidget";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

export default function Layout() {
  return (
    <>
      <Navigation />
      <ScrollToTop />
      <ToastContainer />
      <Outlet />
      <Footer />
      <ChatWidget />
    </>
  );
}