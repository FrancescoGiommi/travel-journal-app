import "./App.css";

import { Route, Routes, BrowserRouter } from "react-router-dom";

import HomePage from "./pages/HomePage";
import DetailsPage from "./pages/DetailsPage";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<DetailsPage />} path="/details" />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
