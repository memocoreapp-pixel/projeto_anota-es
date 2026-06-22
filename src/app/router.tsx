import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Home } from "@/pages/Home";
import { SpaceListPage } from "@/pages/spaces/SpaceListPage";
import { CoverLabPage } from "@/components/spaces/cover-lab/CoverLabPage";

// Sob GitHub Pages o app roda em um subcaminho (ex.: /projeto_anota-es/).
// O basename usa o BASE_URL definido pelo Vite, sem a barra final.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "espacos/:spaceId", element: <SpaceListPage /> },
        { path: "cover-lab", element: <CoverLabPage /> },
      ],
    },
  ],
  { basename }
);
