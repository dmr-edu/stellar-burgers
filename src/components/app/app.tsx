import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Provider } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import store from '../../services/store';
import { useDispatch } from '../../services/store';
import { checkUserAuth } from '../../services/slices/userSlice';

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Outlet />
    </div>
  );
};

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
