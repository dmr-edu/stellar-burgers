import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useDispatch, useSelector } from '@store';
import { feedSelector, getFeeds } from '@slices';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, feedRequest } = useSelector(feedSelector);

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  if (feedRequest) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeeds())} />;
};
