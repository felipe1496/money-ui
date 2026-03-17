import { client } from './client';
import type { QueryOpts } from '../utils/types';
import { getDefinedKeys } from '../utils/functions';

export const RecurrencesService = {
  async getRecurrences(queryOpts?: QueryOpts) {
    const response = await client.get<{
      data: {
        recurrences: {
          id: string;
          user_id: string;
          name: string;
          note?: string | null;
          amount: number;
          day_of_month: number;
          category_id?: string | null;
          category_name?: string | null;
          category_color?: string | null;
          start_period: string;
          end_period?: string | null;
          created_at: string;
        }[];
      };
      query: {
        page: number;
        per_page: number;
        next_page: boolean;
        total_pages: number;
        total_items: number;
      };
    }>('/v1/recurrences', {
      params: queryOpts,
    });

    return response.data;
  },

  async deleteRecurrence({ id, scope }: { id: string; scope: 'all' | 'until_current' }) {
    await client.delete(`/v1/recurrences/${id}`, {
      params: { scope },
    });
  },

  async postRecurrence(payload: {
    name: string;
    category_id?: string | null;
    note?: string | null;
    amount: number;
    day_of_month: number;
    start_period: string;
    end_period?: string | null;
  }) {
    const response = await client.post<{
      data: {
        recurrence: {
          id: string;
          user_id: string;
          name: string;
          note?: string | null;
          amount: number;
          day_of_month: number;
          category_id?: string | null;
          category_name?: string | null;
          category_color?: string | null;
          start_period: string;
          end_period?: string | null;
          created_at: string;
        };
      };
    }>('/v1/recurrences', payload);

    return response.data;
  },

  async updateRecurrence(params: {
    recurrenceId: string;
    payload: {
      name?: string;
      category_id?: string | null;
      note?: string | null;
      amount?: number;
      day_of_month?: number;
      start_period?: string;
      end_period?: string | null;
    };
  }) {
    const response = await client.patch<{
      data: {
        recurrence: {
          id: string;
          user_id: string;
          name: string;
          note?: string | null;
          amount: number;
          day_of_month: number;
          category_id?: string | null;
          category_name?: string | null;
          category_color?: string | null;
          start_period: string;
          end_period?: string | null;
          created_at: string;
        };
      };
    }>(`/v1/recurrences/${params.recurrenceId}`, {
      update: getDefinedKeys(params.payload),
      ...params.payload,
    });

    return response.data;
  },

  async prepareRecurrences(period: string) {
    await client.post(`/v1/recurrences/${period}`);
  },
};
