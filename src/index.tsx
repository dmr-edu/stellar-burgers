import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './components/app/app';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import { Modal, IngredientDetails, OrderInfo } from '@components';
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
              <Modal title='Ingredients details' onClose={goBack}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Route>
        <Route path='feed'>
          <Route index element={<Feed />} />
          <Route
            path=':number'
            element={
              <Modal title='Feed details' onClose={console.log}>
                <OrderInfo />
              </Modal>
            }
          />
        </Route>
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
        <Route path='reset-password' element={<ResetPassword />} />
        <Route path='profile'>
          <Route index element={<Profile />} />
          <Route path='orders' element={<ProfileOrders />} />
          <Route
            path='orders/:number'
            element={
              <Modal title='Order details' onClose={console.log}>
                <OrderInfo />
              </Modal>
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
