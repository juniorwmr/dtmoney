import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./services/api";

export interface ITransaction {
  id: string;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

type TransactionInput = Omit<ITransaction, "id" | "createdAt">;

interface TransactionsContextData {
  transactions: ITransaction[];
  createTransaction: (transaction: TransactionInput) => Promise<number>;
}

export const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
);

export function TransactionsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  useEffect(() => {
    api
      .get("/transactions")
      .then((response) => setTransactions(response.data.transactions));
  }, []);

  async function createTransaction(transaction: TransactionInput) {
    const newTransactionData = {
      title: transaction.title,
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
    };

    const { status, data } = await api.post(
      "/transactions",
      newTransactionData
    );
    setTransactions((oldTransactions) => [
      ...oldTransactions,
      data.transaction,
    ]);

    return status;
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactionsContext() {
  return useContext(TransactionsContext);
}
