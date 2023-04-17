import { useThrottleFn } from 'ahooks';
import { useRef } from 'react';

export const useScrollSync = () => {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const left = leftRef.current! as any;
  const right = rightRef.current! as any;

  const handleScroll = (event: any) => {
    const scrollTopRatio =
      event.target.scrollTop / (event.target.scrollHeight - event.target.clientHeight);
    if (event.target === left) {
      right.scrollTop = scrollTopRatio * (right.scrollHeight - right.clientHeight);
    } else if (event.target === right) {
      left.scrollTop = scrollTopRatio * (left.scrollHeight - left.clientHeight);
    }
  };

  const { run: handleScrollRun } = useThrottleFn(handleScroll, { wait: 60 });

  return {
    leftRef,
    rightRef,
    handleScrollRun
  };
};
