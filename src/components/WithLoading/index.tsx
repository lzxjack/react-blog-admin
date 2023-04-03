import React, { Suspense } from 'react';

import Loading from '@/components/Loading';

interface Props {
  children: any;
}

const WithLoading = ({ children }: Props) => {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

export default WithLoading;
