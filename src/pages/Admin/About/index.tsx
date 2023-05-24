import { useMount, useRequest, useTitle } from 'ahooks';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AboutBase from '@/components/AboutBase';
import { selectAbout } from '@/redux/selectors';
import { setAboutMe, setAboutSite } from '@/redux/slices/about';
import { getDataAPI } from '@/utils/apis/getData';
import { siteTitle } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';
import { useUpdateData } from '@/utils/hooks/useUpdateData';

import { Title } from '../titleConfig';
import s from './index.scss';

const About: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.About}`);

  const dispatch = useDispatch();
  const about = useSelector(selectAbout);

  const { run } = useRequest(() => getDataAPI(DB.About), {
    retryCount: 3,
    manual: true,
    onSuccess: res => {
      const [aboutSite, aboutMe] = res.data;
      dispatch(setAboutMe({ id: aboutMe._id, value: aboutMe.content }));
      dispatch(setAboutSite({ id: aboutSite._id, value: aboutSite.content }));
    }
  });

  useMount(() => {
    if (!about.aboutMe.isDone || !about.aboutSite.isDone) {
      run();
    }
  });

  useUpdateData([{ key: 'updated', run }]);

  return (
    <div className={s.aboutBox}>
      <div className={s.left}>
        <AboutBase content={about.aboutMe.value} site='关于我' params={1} />
      </div>
      <div className={s.right}>
        <AboutBase content={about.aboutSite.value} site='关于本站' params={0} />
      </div>
    </div>
  );
};

export default About;
