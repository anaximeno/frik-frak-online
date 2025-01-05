import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/authProvider";
import { ProtectedRoute } from "./ui/components/protected-route";

import HomePage from "./ui/pages/home";
import FrikFrakPage from "./ui/pages/frikfrak";
import LoginPage from "./ui/pages/login";
import RegisterPage from "./ui/pages/register";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/frik-frak/play" element={<FrikFrakPage />} />
            {/* TODO: lists ongoing games*/}
            {/* <Route path="/frik-frak/watch" element={<FrikFrakPage />} /> */}
            {/* TODO: shows ongoing game play*/}
            {/* <Route path="/frik-frak/watch/:gameId" element={<FrikFrakPage />} /> */}
            {/* TODO: shows leaderboard*/}
            {/* <Route path="/frik-frak/leaderboard" element={<FrikFrakPage />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
