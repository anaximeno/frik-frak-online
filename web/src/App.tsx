import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./ui/pages/home";
import FrikFrakPage from "./ui/pages/frikfrak";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/frik-frak/play" element={<FrikFrakPage />} />
        {/* TODO: lists ongoing games*/}
        {/* <Route path="/frik-frak/watch" element={<FrikFrakPage />} /> */}
        {/* TODO: shows ongoing game play*/}
        {/* <Route path="/frik-frak/watch/:gameId" element={<FrikFrakPage />} /> */}
        {/* TODO: shows leaderboard*/}
        {/* <Route path="/frik-frak/board" element={<FrikFrakPage />} /> */}
        {/* TODO: register new account*/}
        {/* <Route path="/register" element={<RegisterPage />} /> */}
        {/* TODO: login with an account*/}
        {/* <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
