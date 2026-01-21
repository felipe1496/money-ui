import { useSuspenseQuery } from '@tanstack/react-query';
import { categoriesKeys, getCategoriesQueryOpts } from '../../../queries/categories-queries';
import { Card } from '../../../components/commons/Card';
import { Button } from '../../../components/commons/Button';
import { SquarePenIcon, TrashIcon } from 'lucide-react';
import { useDeleteCategory } from '../../../hooks/mutations/useDeleteCategory';
import { useConfirm } from '../../../hooks/useConfirm';
import { SaveCategoryDialog } from './SaveCategoryDialog';
import { usePatchCategory } from '../../../hooks/mutations/usePatchCategory';
import { useState, type ComponentProps } from 'react';
import { entriesKeys } from '../../../queries/transactions-queries';

export const CategoriesList = () => {
  const [isEditing, setIsEditing] = useState<{
    id: string;
    defaultValues: NonNullable<ComponentProps<typeof SaveCategoryDialog>['defaultValues']>;
  }>();
  const confirm = useConfirm();

  const { data: categoriesData } = useSuspenseQuery({
    ...getCategoriesQueryOpts({
      order_by: 'created_at',
      order: 'desc',
    }),
  });

  const { mutate: deleteCategory } = useDeleteCategory({
    meta: {
      successNotification: 'Category deleted successfully',
      errorNotification: 'There was an error deleting the category',
      invalidateQuery: [categoriesKeys.all(), entriesKeys.all()],
    },
  });

  const { mutate: patchCategory, isPending: isPatchCategoryPending } = usePatchCategory({
    meta: {
      successNotification: 'Category updated successfully',
      errorNotification: 'There was an error updating the category',
      invalidateQuery: [categoriesKeys.all()],
    },
  });

  return (
    <Card
      className="flex justify-center"
      header={
        <h2 className="text-muted-foreground">Create categories and assign to your transactions</h2>
      }
    >
      <div className="flex w-full max-w-4xl flex-col gap-2">
        {categoriesData.data.categories.length > 0 ? (
          categoriesData.data.categories.map((category) => (
            <div className="flex w-full justify-between" key={`category-${category.id}`}>
              <div className="flex items-center gap-2">
                <div
                  className="size-5 rounded-full shadow-sm"
                  style={{ backgroundColor: category.color }}
                />
                <p>{category.name}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => {
                    setIsEditing({
                      id: category.id,
                      defaultValues: {
                        name: category.name,
                        color: category.color,
                      },
                    });
                  }}
                >
                  <SquarePenIcon className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() =>
                    confirm.add(
                      'Delete Category',
                      'This action will delete this category and let entries associated to it orphaned.',
                      () => deleteCategory(category.id),
                    )
                  }
                >
                  <TrashIcon className="size-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center">
            <img src="/empty_state_tag.webp" alt="" className="size-20" />
            <span className="mt-3 text-lg font-medium">No transactions with categories yet</span>
            <span>Categorize your transactions to check some insights</span>
          </div>
        )}
      </div>
      {isEditing && (
        <SaveCategoryDialog
          isVisible={!!isEditing}
          onVisibleChange={() => setIsEditing(undefined)}
          defaultValues={isEditing?.defaultValues}
          onSave={(data) => {
            patchCategory({
              id: isEditing?.id as string,
              payload: {
                name: data.name,
                color: data.color,
              },
            });
            setIsEditing(undefined);
          }}
          isLoading={isPatchCategoryPending}
        />
      )}
    </Card>
  );
};
