import type { FC } from 'react';
import { Page } from '../components/commons/Page';

export const HomePage: FC = () => {
  return (
    <Page>
      <main className="flex flex-col px-8 py-16">
        <span className="font-title text-2xl font-bold">Overview</span>
      </main>
    </Page>
  );
};
