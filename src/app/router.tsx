import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Home } from "@/pages/Home";
import { SpacePlaceholder } from "@/pages/SpacePlaceholder";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "portfolios", element: <SpacePlaceholder spaceId="portfolios" /> },
      { path: "projetos", element: <SpacePlaceholder spaceId="projetos" /> },
      { path: "cadernos", element: <SpacePlaceholder spaceId="cadernos" /> },
      { path: "anotacoes", element: <SpacePlaceholder spaceId="anotacoes" /> },
      { path: "rascunhos", element: <SpacePlaceholder spaceId="rascunhos" /> },
      { path: "cards", element: <SpacePlaceholder spaceId="cards" /> },
    ],
  },
]);
