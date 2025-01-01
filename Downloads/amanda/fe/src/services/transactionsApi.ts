/////src/services/transactionsApi.ts//////
import axios from 'axios';
import api from '../utils/api';
import { 
  BulkUpdateParams,
  TransactionParams, 
  TransactionsResponse, 
  Transaction,
  TransactionCategories,
  TransactionQueryParams,
  TransLog,
  TransactionTag,
  Tag,
  BulkUpdateResponse
} from '../utils/types';

export const transactionsApi = {
  async fetch(params: TransactionParams): Promise<TransactionsResponse> {
    try {
      // Debug log the incoming parameters
      console.log('TransactionsAPI fetch params:', params);

      // Create a flat params object with type-safe handling of filters
      const apiParams: Record<string, string | number | boolean | undefined> = {
        page: params.page,
        pageSize: params.itemsPerPage,
        sortColumn: params.sortColumn,
        sortDirection: params.sortDirection,
        type: params.transactionType
      };

      // Safely spread filter properties if they exist
      if (params.filters) {
        const { search, minAmount, maxAmount, month } = params.filters;
        Object.assign(apiParams, {
          search,
          minAmount: minAmount !== undefined ? Number(minAmount) : undefined,
          maxAmount: maxAmount !== undefined ? Number(maxAmount) : undefined,
          month
        });
      }

      // Remove undefined values
      Object.keys(apiParams).forEach(key => {
        if (apiParams[key] === undefined) {
          delete apiParams[key];
        }
      });

      console.log('Final API params:', apiParams);

      const response = await api.get('/transactions', { 
        params: apiParams
      });

      console.log('API Response:', {
        status: response.status,
        recordCount: response.data.transactions?.length,
        totalRecords: response.data.totalRecords
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching transactions:", {
        error,
        params,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  async put(id: number, transaction: Partial<Transaction>): Promise<Transaction> {
    try {
      const response = await api.put(`/transactions/${id}`, transaction);
      return response.data;
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  },

// services/transactionsApi.ts

async bulkUpdate(params: BulkUpdateParams): Promise<BulkUpdateResponse> {
  console.log('Initiating bulk update:', params);
  
  try {
    if (!params.transactionIds.length) {
      throw new Error('No transactions selected');
    }

    const response = await api.post('/transactions/bulk-update', params);
    return response.data;
  } catch (error) {
    console.error("Error in bulk update:", {
      error,
      params,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
},

  async getTags(type: string): Promise<Tag[]> {
    try {
      const response = await api.get(`/tags`, {
        params: { type }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching tags:", error);
      throw error;
    }
  },

  async getTransactionTag(transactionId: number): Promise<TransactionTag | null> {
    try {
      const response = await api.get(`/transactions/${transactionId}/tag`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },


  async updateCategory(
    transactionId: number,
    {
      business,
      flag,
      lock,
      hidden,
      split,
      income,
      deposit,
      expense
    }: {
      business: boolean;
      flag: boolean;
      lock: boolean;
      hidden: boolean;
      split: boolean;
      income?: boolean;
      deposit?: boolean;
      expense?: boolean;
    }
  ): Promise<TransactionCategories> {
    try {
      const response = await api.put(`/transactions/${transactionId}/category`, {
        business,
        flag,
        lock,
        hidden,
        split,
        income,
        deposit,
        expense
      });
      return response.data;
    } catch (error) {
      console.error("Error updating transaction categories:", error);
      throw error;
    }
  },

  async getCategories(transactionId: number): Promise<TransactionCategories> {
    try {
      const response = await api.get(`/transactions/${transactionId}/category`);
      return response.data;
    } catch (error) {
      console.error("Error fetching transaction categories:", error);
      throw error;
    }
  },

  async updateLabel(
    transactionId: number,
    label: string,
    replaceAllLabel: boolean = false,
    applyToFuture: boolean = false
  ): Promise<Transaction> {
    try {
      const response = await api.put(`/transactionlabel/${transactionId}`, {
        label,
        replaceAllLabel,
        applyToFuture,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating transaction label:", error);
      throw error;
    }
  },

  async updateTransactionTag(transactionId: number, tagId: number): Promise<Transaction> {
    try {
      const response = await api.put(`/transactions/${transactionId}/tag`, {
        tagId
      });
      return response.data;
    } catch (error) {
      console.error("Error updating transaction tag:", error);
      throw error;
    }
  },  

  async getLogs(transactionId: number): Promise<TransLog[]> {
    try {
      const response = await api.get(`/translog/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching transaction logs:", error);
      throw error;
    }
  },

  async getLogCount(transactionId: number): Promise<number> {
    try {
      const response = await api.get(`/translog/count/${transactionId}`);
      return response.data.count;
    } catch (error) {
      console.error("Error getting transaction log count:", error);
      return 0;
    }
  },

  async addLog(params: {
    fieldName: string;
    oldValue: string;
    newValue: string;
    transactionId: number;
    method?: 'human' | 'robot' | 'rule';
  }): Promise<any> {
    try {
      const response = await api.post('/translog', params);
      return response.data;
    } catch (error) {
      console.error("Error adding transaction log:", error);
      throw error;
    }
  },
  

  async getTotal(): Promise<number> {
    try {
      const response = await api.get("/totaltransactions");
      return response.data;
    } catch (error) {
      console.error("Error fetching total transactions:", error);
      throw error;
    }
  },

  async getIncomeTransactions(params: TransactionQueryParams): Promise<TransactionsResponse> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
      const response = await api.get(`/income?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching income transactions:", error);
      throw error;
    }
  },

};

