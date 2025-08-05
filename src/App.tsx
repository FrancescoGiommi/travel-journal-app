import "./App.css";

import { Route, Routes, BrowserRouter } from "react-router-dom";
import { GlobalContextProvider } from "./context/GlobalContext";

import HomePage from "./pages/HomePage";
import DetailsPage from "./pages/DetailsPage";
function App() {
  return (
    <>
      <GlobalContextProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<HomePage />} path="/" />
            <Route element={<DetailsPage />} path="/details/:id" />
          </Routes>
        </BrowserRouter>
      </GlobalContextProvider>
    </>
  );
}

export default App;
