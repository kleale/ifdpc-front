import { lazy, Suspense } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { PATHS } from 'shared/typesAndConsts/router';
import { Loader } from 'shared/ui/Loader';

const ErrorPage = lazy(() => import('pages/ErrorPage'));
const MainPage = lazy(() => import('pages/MainPage'));

export const AppRoutes = () => {
  const location = useLocation();

  return (
    <Suspense key={location.key} fallback={<Loader />}>
      <Routes>
        <Route path={PATHS.MAIN_PAGE} element={<MainPage />} />
        <Route path={PATHS.ERROR} element={<ErrorPage />} />
        <Route path={PATHS.UNDEFINED} element={<Navigate to="/error/404" />} />
      </Routes>
    </Suspense>
  );
};
