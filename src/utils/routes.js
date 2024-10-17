import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import { 
    HOME_PAGE_ROUTE,

} from "./consts";

export const routes = [
    {
        path: HOME_PAGE_ROUTE,
        element: HomePage,
    },
   
    {
        path: "*",
        element: NotFoundPage,
      },

];
