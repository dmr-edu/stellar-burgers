import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { loginUser, userSelector } from '@slices';
import { useDispatch, useSelector } from '@store';
import { useNavigate } from 'react-router-dom';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginUserError, loginUserRequest } = useSelector(userSelector);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await dispatch(loginUser({ email, password }));
    navigate('/');
  };

  if (loginUserRequest) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={loginUserError || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
