import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./ui/pages/home";
import FrikFrakPage from "./ui/pages/frikfrak";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/frik-frak" element={<FrikFrakPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
