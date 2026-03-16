import { useState, type FC } from 'react';
import { AsyncSelect, type Option } from './commons/select/AsyncSelect';
import { useQuery } from '@tanstack/react-query';
import { categoriesKeys, getCategoriesQueryOpts } from '../queries/categories-queries';
import type { CategoriesService } from '../services/CategoriesService';
import { useDebounce } from '../hooks/useDebounce';
import { SaveCategoryDialog } from '../pages/categories/components/SaveCategoryDialog';
import { usePostCategory } from '../hooks/mutations/usePostCategory';

interface Props {
  selected?: Option<
    Awaited<ReturnType<typeof CategoriesService.getCategories>>['data']['categories'][number]
  > | null;
  onChange?: (
    value: Option<
      Awaited<ReturnType<typeof CategoriesService.getCategories>>['data']['categories'][number]
    > | null,
  ) => void;
  isCreatable?: boolean;
}

export const AsyncSelectCategory: FC<Props> = ({
  selected = null,
  onChange = () => {},
  isCreatable,
}) => {
  const [search, setSearch] = useState<string>('');
  const [creatingName, setCreatingName] = useState<string>('');
  const [addCategoryVisible, setAddCategoryVisible] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isFetching } = useQuery({
    ...getCategoriesQueryOpts({
      name: debouncedSearch,
    }),
    select: (data) =>
      data.data.categories.map((category) => ({
        id: category.id,
        value: category,
        label: category.name,
      })),
  });

  const { mutateAsync: postCategory, isPending } = usePostCategory({
    meta: {
      successNotification: 'Category created successfully',
      errorNotification: 'There was an error creating the category',
      invalidateQuery: [categoriesKeys.all()],
    },
  });

  return (
    <>
      <AsyncSelect
        options={data ?? []}
        isLoading={isFetching}
        search={search}
        selected={selected}
        onSelectedChange={onChange}
        onSearchChange={setSearch}
        placeholder="Select a category..."
        onCreate={
          isCreatable
            ? (name) => {
                setCreatingName(name);
                setAddCategoryVisible(true);
              }
            : undefined
        }
      />
      {isCreatable && addCategoryVisible && (
        <SaveCategoryDialog
          isVisible={addCategoryVisible}
          onSave={(data, { reset }) => {
            postCategory(
              {
                name: data.name,
                color: data.color,
              },
              {
                onSuccess: (result) => {
                  const category = result.data.category;
                  const option = {
                    id: category.id,
                    value: category,
                    label: category.name,
                  };

                  onChange(option);
                  setAddCategoryVisible(false);
                  reset();
                },
              },
            );
          }}
          onVisibleChange={() => {
            setCreatingName('');
            setAddCategoryVisible(false);
          }}
          defaultValues={{ name: creatingName, color: '' }}
          isLoading={isPending}
        />
      )}
    </>
  );
};
