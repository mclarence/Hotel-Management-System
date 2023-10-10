import {Transaction} from "@hotel-management-system/models";
import pgPromise, {IDatabase} from "pg-promise";
import QueryResultError = pgPromise.errors.QueryResultError;
import queries from "./sql/queries";

export interface ITransactionDAO {
    getTransactions(): Promise<Transaction[]>;

    getTransaction(transactionId: number): Promise<Transaction>;

    createTransaction(transaction: Transaction): Promise<Transaction>;

    updateTransaction(transaction: Transaction): Promise<Transaction>;

    deleteTransaction(transactionId: number): Promise<Transaction>;

    checkTransactionExistsById(transactionId: number): Promise<boolean>;
}


export const makeTransactionsDAO = (db: IDatabase<any, any>): ITransactionDAO => {
    const getTransactions = async (): Promise<Transaction[]> => {
        return await db.any(queries.transactions.getTransactions);
    }

    const getTransaction = async (transactionId: number): Promise<Transaction> => {
        try {
            return await db.one(queries.transactions.getTransactionById, [transactionId]);
        } catch (e) {
            if (e instanceof QueryResultError && e.code === pgPromise.errors.queryResultErrorCode.noData) {
                throw new Error(`Transaction ${transactionId} not found!`);
            }
            throw e;
        }
    }

    const createTransaction = async (transaction: Transaction): Promise<Transaction> => {
        return await db.one(queries.transactions.addTransaction, [transaction.paymentMethodId, transaction.guestId, transaction.amount, transaction.description, transaction.date]);
    }

    const updateTransaction = async (transaction: Transaction): Promise<Transaction> => {
        return await db.one(queries.transactions.updateTransaction, [transaction.paymentMethodId, transaction.guestId, transaction.amount, transaction.description, transaction.date, transaction.transactionId]);
    }

    const deleteTransaction = async (transactionId: number): Promise<Transaction> => {
        return await db.none(queries.transactions.deleteTransaction, [transactionId]);
    }

    const checkTransactionExistsById = async (transactionId: number): Promise<boolean> => {
        const exists = await db.one(queries.transactions.checkTransactionExistsById, [transactionId]);
        return exists.exists;
    }

    return {
        getTransactions,
        getTransaction,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        checkTransactionExistsById
    }
}