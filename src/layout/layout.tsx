import { Outlet, useLocation } from "react-router-dom";
import Navigation from "../components/Nav";
import Footer from "../components/footer";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

declare global {
  interface Window {
    LamaticChatWidget?: {
      resetChatHistory: () => Promise<void>;
    };
  }
}

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function Layout() {
useEffect(() => {
  localStorage.clear();
  sessionStorage.clear();

  const PROJECT_ID = "d4488e01-40b6-48a2-ab7e-736a2784aa1c";
  const FLOW_ID = "7a6e3030-767f-4b21-b757-22b043e84b3a";
  const API_URL = "https://sujalsorganization861-sujalsproject215.lamatic.dev";

  const handleWidgetReady = () => {
    if (window.LamaticChatWidget?.resetChatHistory) {
      window.LamaticChatWidget
        .resetChatHistory()
        .then(() => console.log("Chat history reset successfully"))
        .catch((error) => console.error("Reset error:", error));
    }
  };

  window.addEventListener("lamaticChatWidgetReady", handleWidgetReady);

  if (!document.getElementById("lamatic-chat-root")) {
    const root = document.createElement("div");
    root.id = "lamatic-chat-root";
    root.dataset.apiUrl = API_URL;
    root.dataset.flowId = FLOW_ID;
    root.dataset.projectId = PROJECT_ID;
    document.body.appendChild(root);

    const script = document.createElement("script");
    script.id = "lamatic-chat-script";
    script.type = "module";
    script.src = `https://widget.lamatic.ai/chat-v2?projectId=${PROJECT_ID}&flowId=${FLOW_ID}&greetingMessage=${encodeURIComponent("Hi, I am Guide Daju. Ask me anything about Sikkim!")}&t=${Date.now()}`;
    document.body.appendChild(script);

    // Force position after widget injects itself
    const observer = new MutationObserver(() => {
      const allFixed = root.querySelectorAll<HTMLElement>("*");
      allFixed.forEach((el) => {
        const computed = window.getComputedStyle(el);
        if (computed.position === "fixed" || computed.position === "absolute") {
          el.style.setProperty("right", "auto", "important");
          el.style.setProperty("left", "20px", "important");
        }
      });
    });

    // ✅ root is guaranteed to exist here
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("lamaticChatWidgetReady", handleWidgetReady);
      observer.disconnect();
      document.getElementById("lamatic-chat-root")?.remove();
      document.getElementById("lamatic-chat-script")?.remove();
    };
  }

  return () => {
    window.removeEventListener("lamaticChatWidgetReady", handleWidgetReady);
  };
}, []);

  return (
    <>
      <Navigation />
      <ScrollToTop />
      <ToastContainer />
      <Outlet />
      <Footer />
    </>
  );
}