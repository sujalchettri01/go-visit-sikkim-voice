import { toast } from "react-toastify";

async function apiFetch(url: any, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "include", // keep cookies
  });

  if (response.status === 401) {

    toast.error("Please Login to continue");
    // redirect to login
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
    return; // stop further execution
  }

  return response;
}
export default apiFetch;