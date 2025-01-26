import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/authProvider";
import { ProtectedRoute } from "./ui/components/protected-route";

import HomePage from "./ui/pages/home";
import FrikFrakPage from "./ui/pages/frikfrak";
import LoginPage from "./ui/pages/login";
import RegisterPage from "./ui/pages/register";
import AppDrawer from "./ui/components/app-drawer";

const App = () => {
  return (
    <AuthProvider>
      <AppDrawer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/frik-frak/play"
              element={<FrikFrakPage view="play" />}
            />
            <Route
              path="/frik-frak/watch"
              element={<FrikFrakPage view="watch" />}
            />
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
