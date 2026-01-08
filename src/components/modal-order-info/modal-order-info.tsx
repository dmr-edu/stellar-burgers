import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal } from '@components';
import { OrderInfo } from '@components';

export const ModalOrderInfo: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    // Определяем, на какую страницу вернуться
    if (location.pathname.startsWith('/feed/')) {
      navigate('/feed');
    } else if (location.pathname.startsWith('/profile/orders/')) {
      navigate('/profile/orders');
    } else {
      navigate(-1);
    }
  };

  return (
    <Modal title='' onClose={handleClose}>
      <OrderInfo />
    </Modal>
  );
};
