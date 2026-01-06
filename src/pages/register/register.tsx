import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '@store';
import { registerUser, userSelector } from '@slices';
import { useNavigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { registerUserError, registerUserRequest } = useSelector(userSelector);
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const result = await dispatch(
      registerUser({
        email,
        name: userName,
        password
      })
    );
    // Редирект только при успешной регистрации
    if (registerUser.fulfilled.match(result)) {
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    }
    // При ошибке остаемся на странице регистрации
  };

  if (registerUserRequest) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={registerUserError || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
