import Layout from "../layout/layout";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
import DestinationsPage from "../pages/destinations";
import ActivitiesPage from "../pages/activities";
import CulturePage from "../pages/cultures";
import AccommodationsPage from "../pages/accommodation";
import TourDetailPage from "../pages/destinations/detail";
import ActivityDetailPage from "../pages/activities/detail";
import AccommodationDetailPage from "../pages/accommodation/detail";
import CabsListingPage from "../pages/cabs";
import BikesListingPage from "../pages/bikes";
import CultureDetailPage from "../pages/cultures/detail";
import ContactPage from "../pages/contact";
import LoginPage from "../pages/login/login";
import SignupPage from "../pages/register/register";
import AuthCallback from "../pages/AuthCallback";
import Root from "../pages/Root";
import Dashboard from "../pages/Dashboard";
import CabBookingPage from "../pages/cabs/Booking";

const router = createBrowserRouter([
  {
    path: "/user",
    element: <Root />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      // ...other routes
    ],
  },
  // ✅ Outside auth-protected routes
  {
    path: "/auth/callback",
    element: <AuthCallback />,
  },
  {
    path:'/login',
    element: <LoginPage></LoginPage>,
  },
  {
    path: "/register",
    element: <SignupPage></SignupPage>,
  },

  {
    path: "/",
    element: <Layout></Layout>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/destinations",
        element: <DestinationsPage></DestinationsPage>,
      },
      {
        path: "/destinations/:id",
        element: <TourDetailPage></TourDetailPage>,
      },
      {
        path: "/activities",
        element: <ActivitiesPage></ActivitiesPage>,
      },
      {
        path: "/activities/:id",
        element: <ActivityDetailPage></ActivityDetailPage>,
      },
      {
        path: "/cultures",
        element: <CulturePage></CulturePage>,
      },
      {
        path: "/accommodations",
        element: <AccommodationsPage></AccommodationsPage>,
      },
      {
        path: "/accommodations/:id",
        element: <AccommodationDetailPage></AccommodationDetailPage>,
      },
      {
        path: "/cabs",
        element: <CabsListingPage></CabsListingPage>,
      },
      { path: "cabs/book/:id", element: <CabBookingPage /> },
      {
        path: "/bikes",
        element: <BikesListingPage></BikesListingPage>,
      },
      {
        path: "/cultures/:id",
        element: <CultureDetailPage></CultureDetailPage>,
      },
      {
        path: "/contact",
        element: <ContactPage></ContactPage>,
      },
    ],
  },
]);

export default router;
