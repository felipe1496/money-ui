import { Suspense, useState, type FC } from 'react';
import { Page } from '../../components/commons/Page';
import { CategoriesList } from './components/CategoriesList';
import { Button } from '../../components/commons/Button';
import { SaveCategoryDialog } from './components/SaveCategoryDialog';
import { usePostCategory } from '../../hooks/mutations/usePostCategory';
import { categoriesKeys } from '../../queries/categories-queries';
import { LoaderWords } from '../../components/commons/loader/LoaderWords';

export const CategoriesPage: FC = () => {
  const [addCategoryVisible, setAddCategoryVisible] = useState(false);

  const { mutate: postCategory, isPending } = usePostCategory({
    onSuccess: () => setAddCategoryVisible(false),
    meta: {
      successNotification: 'Category created successfully',
      errorNotification: 'There was an error creating the category',
      invalidateQuery: [categoriesKeys.all()],
    },
  });

  return (
    <Page>
      <main className="flex flex-col p-2">
        <header className="mb-4 flex w-full items-center justify-between">
          <h1 className="text-xl font-medium">Categories</h1>

          <SaveCategoryDialog
            isVisible={addCategoryVisible}
            onVisibleChange={setAddCategoryVisible}
            onSave={postCategory}
            isLoading={isPending}
          >
            <Button>Add Category</Button>
          </SaveCategoryDialog>
        </header>

        <Suspense
          fallback={
            <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
              <LoaderWords words={['sums', 'categories', 'spent per month', 'colors', 'labels']} />
            </div>
          }
        >
          <CategoriesList />
        </Suspense>
      </main>
    </Page>
  );
};
