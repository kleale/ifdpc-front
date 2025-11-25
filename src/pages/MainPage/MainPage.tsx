import { Layout } from '@consta/uikit/Layout';
import { MainLayout } from 'shared/ui/MainLayout';
import { Header } from './Header';
import { Content } from './Content';

export const MainPage = () => {
  return (
    <Layout>
      <MainLayout header={<Header/>} content={<Content />}/>
    </Layout>
  );
};
