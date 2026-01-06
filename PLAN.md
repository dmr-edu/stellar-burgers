# План реализации проекта "Stellar Burger"

## ✅ Что уже реализовано

### 1. Роутинг ✅

- Все маршруты настроены в `index.tsx`
- Модальные окна для ингредиентов и заказов настроены
- **Навигация реализована** - NavLink с активными ссылками

### 2. Redux Store ✅

- Store настроен в `store.ts`
- Есть 3 слайса:
  - `userSlice` - авторизация (login/register)
  - `ingredientsSlice` - ингредиенты
  - `constructorSlice` - конструктор бургера

### 3. API методы ✅

- Все методы готовы в `burger-api.ts`:
  - `getIngredientsApi`, `getFeedsApi`, `getOrdersApi`
  - `orderBurgerApi`, `getOrderByNumberApi`
  - `loginUserApi`, `registerUserApi`, `getUserApi`, `updateUserApi`
  - `refreshToken`, `fetchWithRefresh`

### 4. Компоненты ✅

- `BurgerIngredients` - получает данные из store
- `BurgerConstructor` - использует store
- `ConstructorPage` - загружает ингредиенты
- Все UI компоненты созданы

---

## 📋 Что нужно реализовать

### 🔴 ПРИОРИТЕТ 1: Авторизация и защита маршрутов

**📚 Основано на материале:** JWT токены, access/refresh токены, fetchWithRefresh

#### 1.1. Сохранение токенов при авторизации

**Проблема:** Токены не сохраняются при логине/регистрации

- В `userSlice` нет сохранения `accessToken` и `refreshToken` из ответа API
- Нет установки cookies через `setCookie`
- API возвращает `TAuthResponse` с полями: `accessToken`, `refreshToken`, `user`

**Решение (по материалу, часть 2):**
⚠️ **ВАЖНО:** По материалу токены сохраняются **внутри thunk**, а не в `extraReducers`!

- Обновить `loginUser` thunk:

  ```typescript
  export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (
      { email, password }: Omit<TRegisterData, 'name'>,
      { rejectWithValue }
    ) => {
      const data = await loginUserApi({ email, password });
      if (!data?.success) {
        return rejectWithValue(data);
      }
      // Сохранить токены ПРЯМО В THUNK (по материалу)
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      // Возвращаем только пользователя
      return data.user;
    }
  );
  ```

- Аналогично для `registerUser`:

  ```typescript
  export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (data: TRegisterData, { rejectWithValue }) => {
      const response = await registerUserApi(data);
      if (!response?.success) {
        return rejectWithValue(response);
      }
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    }
  );
  ```

- В `extraReducers` теперь `action.payload` это `TUser`, а не весь объект ответа:

  ```typescript
  .addCase(loginUser.fulfilled, (state, action) => {
    state.data = action.payload; // теперь это TUser, а не action.payload.user
    state.loginUserRequest = false;
    state.isAuthenticated = true;
    state.isAuthChecked = true;
  })
  ```

- Импортировать `setCookie` из `@utils/cookie` (уже есть в проекте)

#### 1.2. Проверка авторизации при старте приложения

**Проблема:** Нет проверки токена при загрузке приложения

- Нет thunk для `getUserApi`
- Нет проверки наличия токена в cookies

**Решение (по материалу, часть 2):**

- Создать thunk `checkUserAuth` в `userSlice`:

  ```typescript
  export const checkUserAuth = createAsyncThunk(
    'user/checkUserAuth',
    async (_, { rejectWithValue }) => {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        return rejectWithValue('No token');
      }
      try {
        const data = await getUserApi();
        if (data?.success) {
          return data.user;
        }
        return rejectWithValue(data);
      } catch (error) {
        // Если токен невалидный - очистить токены
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
        return rejectWithValue(error);
      }
    }
  );
  ```

- В `extraReducers` обработать:

  ```typescript
  .addCase(checkUserAuth.pending, (state) => {
    state.isAuthChecked = false;
  })
  .addCase(checkUserAuth.fulfilled, (state, action) => {
    state.data = action.payload;
    state.isAuthenticated = true;
    state.isAuthChecked = true;
  })
  .addCase(checkUserAuth.rejected, (state) => {
    state.isAuthenticated = false;
    state.isAuthChecked = true;
    state.data = null;
  })
  ```

- Вызывать `dispatch(checkUserAuth())` в `App.tsx` при монтировании:

  ```typescript
  import { useEffect } from 'react';
  import { useDispatch } from '@store';
  import { checkUserAuth } from '@slices';

  const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(checkUserAuth());
    }, [dispatch]);

    return (
      <Provider store={store}>
        <div className={styles.app}>
          <AppHeader />
          <Outlet />
        </div>
      </Provider>
    );
  };
  ```

- Импортировать `getCookie`, `deleteCookie` из `@utils/cookie`

**Примечание:** В материале показан вариант с `dispatch(authChecked())` в thunk, но мы используем `isAuthChecked` через `extraReducers`, что также корректно и более соответствует Redux Toolkit паттернам.

#### 1.3. Защищенные роуты

**Проблема:** Нет защиты для `/profile` и `/profile/orders`

- Нет компонента-обертки для проверки авторизации
- Нет редиректа на `/login` для неавторизованных
- Нет защиты для гостевых роутов (`/login`, `/register`) от авторизованных пользователей

**Решение (по материалу, часть 3):**

- Создать компонент `ProtectedRoute` в `src/components/protected-route/`:

  ```typescript
  import { FC, ReactElement } from 'react';
  import { Navigate, useLocation } from 'react-router-dom';
  import { useSelector } from '@store';
  import { userSelector } from '@slices';
  import { Preloader } from '@ui';

  type ProtectedRouteProps = {
    onlyUnAuth?: boolean;
    children: ReactElement;
  };

  export const ProtectedRoute: FC<ProtectedRouteProps> = ({ onlyUnAuth, children }) => {
    const { isAuthChecked, isAuthenticated, data: user } = useSelector(userSelector);
    const location = useLocation();

    // Пока идет проверка авторизации - показываем прелоадер
    if (!isAuthChecked) {
      return <Preloader />;
    }

    // Если маршрут требует авторизации, а пользователь не авторизован
    if (!onlyUnAuth && !isAuthenticated) {
      // Сохраняем текущий маршрут в state для возврата после авторизации
      return <Navigate replace to="/login" state={{ from: location }} />;
    }

    // Если маршрут только для неавторизованных (login/register), а пользователь авторизован
    if (onlyUnAuth && isAuthenticated) {
      // Возвращаем на исходный маршрут или на главную
      const from = location.state?.from?.pathname || '/';
      return <Navigate replace to={from} />;
    }

    return children;
  };
  ```

- Создать `src/components/protected-route/index.ts`:

  ```typescript
  export { ProtectedRoute } from './protected-route';
  ```

- Добавить экспорт в `src/components/index.ts` (если нужно):

  ```typescript
  export { ProtectedRoute } from './protected-route';
  ```

- Обновить роуты в `index.tsx`:

  ```typescript
  // Гостевые роуты (только для неавторизованных)
  <Route path='login' element={<ProtectedRoute onlyUnAuth><Login /></ProtectedRoute>} />
  <Route path='register' element={<ProtectedRoute onlyUnAuth><Register /></ProtectedRoute>} />
  <Route path='forgot-password' element={<ProtectedRoute onlyUnAuth><ForgotPassword /></ProtectedRoute>} />
  <Route path='reset-password' element={<ProtectedRoute onlyUnAuth><ResetPassword /></ProtectedRoute>} />

  // Защищенные роуты (только для авторизованных)
  <Route path='profile'>
    <Route index element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path='orders' element={<ProtectedRoute><ProfileOrders /></ProtectedRoute>} />
    <Route
      path='orders/:number'
      element={
        <ProtectedRoute>
          <Modal title='Order details' onClose={console.log}>
            <OrderInfo />
          </Modal>
        </ProtectedRoute>
      }
    />
  </Route>
  ```

- Обновить `Login` компонент для использования `location.state`:

  ```typescript
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await dispatch(loginUser({ email, password }));
    navigate(from); // Редирект на исходный маршрут
  };
  ```

- Аналогично для `Register` компонента

#### 1.4. Проверка авторизации при оформлении заказа

**Проблема:** Нет проверки авторизации в `onOrderClick`

- При нажатии "Оформить заказ" не проверяется авторизация
- Нет редиректа на `/login` если не авторизован

**Решение (по материалу, часть 3):**

- В `BurgerConstructor.onOrderClick` проверять `isAuthenticated` из `userSlice`
- Если не авторизован - использовать `navigate` с сохранением текущего маршрута:

  ```typescript
  import { useNavigate, useLocation } from 'react-router-dom';

  const navigate = useNavigate();
  const location = useLocation();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuthenticated) {
      // Сохраняем текущий маршрут для возврата после авторизации
      navigate('/login', { state: { from: location } });
      return;
    }

    // Если авторизован - вызывать thunk для создания заказа
    dispatch(createOrder(...));
  };
  ```

- После успешной авторизации пользователь вернется на главную страницу и сможет оформить заказ

#### 1.5. Улучшение fetchWithRefresh (опционально)

**Проблема:** Текущая реализация проверяет только `message === 'jwt expired'`

- По материалу нужно проверять `statusCode === 401 || 403`

**Решение (по материалу):**

- Улучшить обработку ошибок в `fetchWithRefresh`:
  ```typescript
  if (error.statusCode === 401 || error.statusCode === 403) {
    // обновить токен и повторить запрос
  }
  ```
- Это улучшит надежность обновления токенов

---

### 🟠 ПРИОРИТЕТ 2: Слайсы для заказов

#### 2.1. Слайс для ленты заказов (Feed)

**Проблема:** Нет слайса для `/feed`

- Нет `feedSlice` для хранения данных ленты заказов
- Нет thunk для `getFeedsApi`

**Решение:**

- Создать `src/services/slices/feedSlice.ts`
- Типы состояния:
  ```typescript
  {
    orders: TOrder[];
    total: number;
    totalToday: number;
    feedRequest: boolean;
    feedError: string | null;
  }
  ```
- Создать thunk `getFeeds` для `getFeedsApi`
- Обработать pending/rejected/fulfilled
- Добавить в `rootReducer`

#### 2.2. Слайс для истории заказов (ProfileOrders)

**Проблема:** Нет слайса для `/profile/orders`

- Нет `ordersSlice` для хранения истории заказов
- Нет thunk для `getOrdersApi`

**Решение:**

- Создать `src/services/slices/ordersSlice.ts`
- Типы состояния:
  ```typescript
  {
    orders: TOrder[];
    ordersRequest: boolean;
    ordersError: string | null;
  }
  ```
- Создать thunk `getOrders` для `getOrdersApi`
- Обработать pending/rejected/fulfilled
- Добавить в `rootReducer`

#### 2.3. Thunk для оформления заказа

**Проблема:** Нет thunk для `orderBurgerApi`

- `onOrderClick` пустой
- Нет сохранения данных заказа в store

**Решение:**

- Добавить thunk `createOrder` в `constructorSlice` или отдельный слайс
- Использовать `orderBurgerApi` с массивом `ingredients` из конструктора
- Сохранить `order` в `orderModalData`
- Обработать ошибки (например, если не авторизован)

---

### 🟡 ПРИОРИТЕТ 3: Подключение данных к страницам

#### 3.1. Страница Feed (`/feed`)

**Проблемы:**

- `orders: []` захардкожен
- Нет загрузки данных при монтировании
- Нет подсчета стоимости заказов
- Нет отображения `total` и `totalToday`

**Решение:**

- Использовать `useSelector(feedSelector)` для получения данных
- Вызывать `dispatch(getFeeds())` в `useEffect`
- Передать `orders` в `FeedUI`
- Подключить `FeedInfo` для отображения статистики
- Реализовать подсчет стоимости в `OrderCard` (используя `ingredients` из store)

#### 3.2. Страница ProfileOrders (`/profile/orders`)

**Проблемы:**

- `orders: []` захардкожен
- Нет загрузки данных при монтировании
- Нет отображения статусов заказов
- Нет подсчета стоимости

**Решение:**

- Использовать `useSelector(ordersSelector)` для получения данных
- Вызывать `dispatch(getOrders())` в `useEffect` (только если авторизован)
- Передать `orders` в `ProfileOrdersUI`
- Реализовать отображение статусов в `OrderStatus`:
  - "Отменён" - если `status === 'cancelled'`
  - "Готовится" - если `status === 'pending'`
  - "Выполнен" - если `status === 'done'`
- Подсчет стоимости через `ingredients` из store

#### 3.3. Страница Profile (`/profile`)

**Проблемы:**

- `handleSubmit` пустой - нет вызова `updateUserApi`
- Нет thunk для обновления данных

**Решение:**

- Создать thunk `updateUser` в `userSlice`
- Использовать `updateUserApi` с данными формы
- Вызывать в `handleSubmit` страницы `Profile`
- Обновить состояние пользователя в store
- Обработать ошибки

#### 3.4. Выход из системы

**Проблемы:**

- `handleLogout` в `ProfileMenu` пустой
- Нет вызова `logoutApi`
- Нет очистки токенов

**Решение:**

- Создать thunk `logoutUser` в `userSlice`
- Вызывать `logoutApi`
- Очистить cookies (`deleteCookie('accessToken')`)
- Очистить localStorage (`localStorage.removeItem('refreshToken')`)
- Сбросить состояние пользователя в store
- Редирект на `/login`

---

### 🟢 ПРИОРИТЕТ 4: Компоненты с данными

#### 4.1. Компонент OrderInfo

**Проблемы:**

- `orderData` и `ingredients` захардкожены
- Не получает данные из store или по номеру заказа

**Решение:**

- Использовать `useParams()` для получения `number` из URL
- Использовать `getOrderByNumberApi(number)` для получения данных заказа
- Или получать из `feedSlice`/`ordersSlice` по номеру
- Получать `ingredients` из `ingredientsSlice`
- Обработать состояние загрузки (Preloader)

#### 4.2. Компонент IngredientDetails

**Проблемы:**

- `ingredientData = null` - данные не получаются

**Решение:**

- Использовать `useParams()` для получения `id` из URL
- Найти ингредиент в `ingredientsSlice` по `_id`
- Если не найден - показать Preloader или ошибку
- Передать данные в `IngredientDetailsUI`

#### 4.3. Компонент OrderCard

**Проблемы:**

- Не получает `ingredients` из store

**Решение:**

- Использовать `useSelector(ingredientsSelector)` для получения всех ингредиентов
- Использовать их для подсчета стоимости и отображения
- Передать в `OrderCardUI`

#### 4.4. Компонент FeedInfo

**Проблемы:**

- Не получает `orders` и `feed` из store

**Решение:**

- Использовать `useSelector(feedSelector)` для получения данных
- Передать `orders`, `total`, `totalToday` в `FeedInfoUI`
- Реализовать подсчет готовых и готовящихся заказов

---

### 🔵 ПРИОРИТЕТ 5: Модальные окна и навигация

#### 5.1. Обработка закрытия модальных окон

**Проблемы:**

- `onClose` в модалках `/feed/:number` и `/profile/orders/:number` использует `console.log`
- Нет правильной навигации при закрытии

**Решение:**

- Использовать `useNavigate()` для закрытия модалок
- При закрытии модалки `/feed/:number` - переход на `/feed`
- При закрытии модалки `/profile/orders/:number` - переход на `/profile/orders`
- При закрытии модалки `/ingredients/:id` - переход на `/` (уже реализовано через `goBack`)

#### 5.2. Обработка прямого перехода на маршруты модалок

**Проблемы:**

- При прямом переходе на `/feed/:number` или `/profile/orders/:number` должна открываться страница, а не модалка

**Решение:**

- Проверять `location.state?.background` для определения способа открытия
- Если есть `background` - показывать модалку
- Если нет - показывать полную страницу
- Использовать `useLocation()` для проверки

---

### 🟣 ПРИОРИТЕТ 6: WebSocket для реального времени (опционально, можно позже)

**Примечание:** По ТЗ требуется "обновление в режиме реального времени", но это можно реализовать после базового функционала.

#### 6.1. WebSocket для ленты заказов

**Требования:**

- Подключение к `wss://norma.nomoreparties.xyz/orders/all`
- Обновление данных при создании нового заказа
- Автоматическое обновление `total` и `totalToday`

**Решение:**

- Создать middleware или хук `useWebSocket`
- Подключаться при монтировании компонента `Feed`
- Обновлять `feedSlice` при получении сообщений
- Обрабатывать переподключение при разрыве связи

#### 6.2. WebSocket для истории заказов

**Требования:**

- Подключение к `wss://norma.nomoreparties.xyz/orders` (с токеном)
- Обновление данных при изменении статуса заказа
- Автоматическое обновление списка заказов

**Решение:**

- Создать защищенное WebSocket подключение с токеном
- Подключаться при монтировании компонента `ProfileOrders` (только если авторизован)
- Обновлять `ordersSlice` при получении сообщений
- Обрабатывать переподключение и обновление токена

---

## 📊 Порядок реализации

### Этап 1: Авторизация (КРИТИЧНО)

1. ✅ Сохранение токенов при логине/регистрации
2. ✅ Проверка авторизации при старте
3. ✅ Защищенные роуты
4. ✅ Проверка при оформлении заказа

### Этап 2: Слайсы для заказов

5. ✅ FeedSlice
6. ✅ OrdersSlice
7. ✅ Thunk для оформления заказа

### Этап 3: Подключение данных

8. ✅ Страница Feed
9. ✅ Страница ProfileOrders
10. ✅ Страница Profile (редактирование)
11. ✅ Выход из системы

### Этап 4: Компоненты

12. ✅ OrderInfo
13. ✅ IngredientDetails
14. ✅ OrderCard
15. ✅ FeedInfo

### Этап 5: Модальные окна

16. ✅ Обработка закрытия модалок
17. ✅ Прямой переход на маршруты

### Этап 6: WebSocket (опционально)

18. ⏳ WebSocket для Feed
19. ⏳ WebSocket для ProfileOrders

---

## 🔍 Дополнительные замечания

### Технические долги

- ✅ В `profile.tsx` строка 59: удален недостижимый `return null;` после основного return
- ✅ В `burger-ingredients.tsx` и `burger-constructor.tsx` нет `return null;` - удалять нечего

### Проверка соответствия ТЗ

- ✅ Роутинг настроен
- ✅ Навигация работает с активными ссылками
- ⏳ Авторизация и защита роутов
- ⏳ Данные загружаются с сервера
- ⏳ Редактирование профиля работает
- ⏳ Оформление заказа работает
- ⏳ Модальные окна работают корректно
- ⏳ WebSocket для реального времени (можно позже)
