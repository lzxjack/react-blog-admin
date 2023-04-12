import { ClearOutlined } from '@ant-design/icons';
import { useResetState, useTitle } from 'ahooks';
import { Input, Select } from 'antd';
import React from 'react';

import MyButton from '@/components/MyButton';
import MyTable from '@/components/MyTable';
import PageHeader from '@/components/PageHeader';
import { siteTitle } from '@/utils/constant';
import { DB } from '@/utils/dbConfig';
import { usePage } from '@/utils/hooks/usePage';
import { useTableData } from '@/utils/hooks/useTableData';

import { Title } from '../titleConfig';
import { useColumns } from './config';

const { Option } = Select;

const Article: React.FC = () => {
  useTitle(`${siteTitle} | ${Title.Articles}`);

  const { page, setPage } = usePage();

  const [title, setTitle, resetTitle] = useResetState('');
  const [classContent, setClassContent, resetClassContent] = useResetState(null);
  const [tags, setTags, resetTags] = useResetState([]);

  const { data, total, loading, handleDelete } = useTableData({
    DBName: DB.Article,
    page,
    setPage
  });

  const handleEdit = (id: string) => {
    console.log(id);
  };

  const columns = useColumns({
    handleEdit,
    handleDelete,
    deleteProps: {
      page,
      setPage
    }
  });

  const clearSearch = () => {
    resetTitle();
    resetClassContent();
    resetTags();
  };

  const render = () => (
    <>
      <Input
        size='large'
        placeholder='输入文章标题'
        style={{ width: 400, marginRight: 5 }}
        value={title}
        onChange={e => setTitle(e.target.value)}
        allowClear
      />
      <Select
        size='large'
        placeholder='请选择文章分类'
        style={{ width: 260, marginRight: 5 }}
        showSearch
        allowClear
      >
        {/* <Option>分类1</Option>
        <Option>分类2</Option>
        <Option>分类3</Option>
        <Option>分类4</Option> */}
      </Select>
      <Select
        size='large'
        mode='multiple'
        placeholder='请选择文章标签'
        style={{ width: 400, marginRight: 5 }}
        showSearch
        showArrow
        allowClear
      >
        {/* <Option>1</Option>
        <Option>2</Option>
        <Option>3</Option>
        <Option>4</Option> */}
      </Select>
      <MyButton
        content={<ClearOutlined />}
        style={{ width: 40, borderRadius: 8, fontSize: 18 }}
        onClick={clearSearch}
      />
    </>
  );

  return (
    <>
      <PageHeader text='写文章' onClick={() => {}} render={render} />
      <MyTable
        loading={loading}
        columns={columns}
        data={data}
        total={total}
        page={page}
        setPage={setPage}
      />
    </>
  );
};

export default Article;
