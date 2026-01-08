import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import store from '../../services/store';
import { useDispatch } from '../../services/store';
import { checkUserAuth } from '../../services/slices/userSlice';
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

const AppContent = () => {
  const dispatch = useDispatch();
  const goBack = () => window.history.back();

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />}>
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
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </Provider>
);

export default App;
