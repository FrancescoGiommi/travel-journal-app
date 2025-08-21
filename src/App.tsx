import "./App.css";

import { Route, Routes, BrowserRouter } from "react-router-dom";
import { GlobalContextProvider } from "./context/GlobalContext";

import HomePage from "./pages/HomePage";
import DetailsPage from "./pages/DetailsPage";
import AddPostPage from "./pages/AddPostPage";
function App() {
  return (
    <>
      <GlobalContextProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<HomePage />} path="/" />
            <Route element={<DetailsPage />} path="/details/:id" />
            <Route element={<AddPostPage />} path="/addPost" />
          </Routes>
        </BrowserRouter>
      </GlobalContextProvider>
    </>
  );
}

export default App;
