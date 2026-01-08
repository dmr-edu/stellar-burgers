import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './components/app/app';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import {
  Modal,
  IngredientDetails,
  ModalOrderInfo,
  ProtectedRoute
} from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);
const goBack = window.history.back.bind(window.history);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<App />}>
        <Route path='' element={<ConstructorPage />}>
          <Route
            path='ingredients/:id'
            element={
              <Modal title='' onClose={goBack}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Route>
        <Route path='feed'>
          <Route index element={<Feed />} />
          <Route path=':number' element={<ModalOrderInfo />} />
        </Route>
        <Route
          path='login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route path='profile'>
          <Route
            index
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path='orders/:number'
            element={
              <ProtectedRoute>
                <ModalOrderInfo />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>
      <Route path='*' element={<NotFound404 />} />
    </>
  )
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
