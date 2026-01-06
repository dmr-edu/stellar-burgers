import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Provider } from 'react-redux';
import { Outlet } from 'react-router-dom';
import store from '../../services/store';

const App = () => (
  <Provider store={store}>
    <div className={styles.app}>
      <AppHeader />
      <Outlet />
    </div>
  </Provider>
);

export default App;
