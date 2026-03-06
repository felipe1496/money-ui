import { useState, type FC } from 'react';
import { AsyncSelect, type Option } from './commons/select/AsyncSelect';
import { useQuery } from '@tanstack/react-query';
import { getCategoriesQueryOpts } from '../queries/categories-queries';
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

export const AsyncSelectCategory: FC<Props> = ({ selected = null, onChange, isCreatable }) => {
  const [search, setSearch] = useState<string>('');
  const [isCreating, setIsCreating] = useState('');

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

  const { mutateAsync: createCategory } = usePostCategory();

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
        onCreate={(value) => {
          setIsCreating(value);
        }}
      />
      {isCreatable && isCreating && (
        <SaveCategoryDialog
          isVisible={!!isCreating}
          onSave={(data) => {
            createCategory(data);
          }}
          onVisibleChange={() => setIsCreating('')}
          defaultValues={{ name: isCreating, color: '' }}
        />
      )}
    </>
  );
};
