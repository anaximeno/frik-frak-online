import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "./ui/components/chakra/provider.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>
);
