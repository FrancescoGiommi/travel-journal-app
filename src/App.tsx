import "./App.css";

import { useEffect } from "react";
import {
  Route,
  Routes,
  BrowserRouter,
  useLocation,
} from "react-router-dom";
import { GlobalContextProvider } from "./context/GlobalContext";

import HomePage from "./pages/HomePage";
import DetailsPage from "./pages/DetailsPage";
import AddPostPage from "./pages/AddPostPage";

function ModalRouteCleanup() {
  const location = useLocation();

  useEffect(() => {
    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
      backdrop.remove();
    });

    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("padding-right");
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <>
      <GlobalContextProvider>
        <BrowserRouter>
          <ModalRouteCleanup />
          <Routes>
            <Route element={<HomePage />} path="/" />
            <Route element={<DetailsPage />} path="/details/:id" />
            <Route element={<AddPostPage />} path="/addPost" />
            <Route element={<AddPostPage />} path="/editPost/:id" />
          </Routes>
        </BrowserRouter>
      </GlobalContextProvider>
    </>
  );
}

export default App;
