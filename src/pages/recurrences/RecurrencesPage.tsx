import { Suspense, useState, type FC } from 'react';
import { Page } from '../../components/commons/Page';
import { Button } from '../../components/commons/Button';
import { SaveRecurrenceDialog } from './components/SaveRecurrenceDialog';
import { RecurrencesList } from './components/RecurrencesList';
import { usePostRecurrence } from '../../hooks/mutations/usePostRecurrence';
import { recurrencesKeys } from '../../queries/recurrences-queries';
import { LoaderWords } from '../../components/commons/loader/LoaderWords';
import { parseUSD } from '../../utils/functions';

export const RecurrencesPage: FC = () => {
  const [addRecurrenceVisible, setAddRecurrenceVisible] = useState(false);

  const { mutate: postRecurrence, isPending } = usePostRecurrence({
    onSuccess: () => setAddRecurrenceVisible(false),
    meta: {
      successNotification: 'Recurrence created successfully',
      errorNotification: 'There was an error creating the recurrence',
      invalidateQuery: [recurrencesKeys.all()],
    },
  });

  return (
    <Page>
      <main className="flex flex-col p-2">
        <header className="mb-4 flex w-full items-center justify-between">
          <h1 className="text-xl font-medium">Recurrences</h1>

          <div className="flex gap-2">
            <SaveRecurrenceDialog
              isVisible={addRecurrenceVisible}
              onVisibleChange={setAddRecurrenceVisible}
              onSave={(data, { reset }) => {
                postRecurrence(
                  {
                    name: data.name,
                    category_id: data.category?.id || null,
                    note: data.note || null,
                    amount: parseUSD(data.amount) * -1,
                    day_of_month: parseInt(data.day_of_month, 10),
                    start_period: data.start_period,
                    end_period: data.end_period,
                  },
                  {
                    onSuccess: () => {
                      reset();
                      setAddRecurrenceVisible(false);
                    },
                  },
                );
              }}
              isLoading={isPending}
            >
              <Button>Add Recurrence</Button>
            </SaveRecurrenceDialog>
          </div>
        </header>

        <Suspense
          fallback={
            <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
              <LoaderWords
                words={['loops', 'recurrences', 'monthly entries', 'automation', 'rules']}
              />
            </div>
          }
        >
          <RecurrencesList onAddClick={() => setAddRecurrenceVisible(true)} />
        </Suspense>
      </main>
    </Page>
  );
};
