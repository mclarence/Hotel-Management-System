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
        try {
            return await db.any(queries.transactions.getTransactions);
        } catch (e) {
            throw e;
        }
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
        try {
            return await db.one(queries.transactions.addTransaction, [transaction.paymentMethodId, transaction.guestId, transaction.amount, transaction.description, transaction.date]);
        } catch (e) {
            console.log(e)
            throw e;
        }
    }

    const updateTransaction = async (transaction: Transaction): Promise<Transaction> => {
        try {
            return await db.one(queries.transactions.updateTransaction, [transaction.paymentMethodId, transaction.guestId, transaction.amount, transaction.description, transaction.date, transaction.transactionId]);
        } catch (e) {
            throw e;
        }
    }

    const deleteTransaction = async (transactionId: number): Promise<Transaction> => {
        try {
            return await db.none(queries.transactions.deleteTransaction, [transactionId]);
        } catch (e) {
            throw e;
        }
    }

    const checkTransactionExistsById = async (transactionId: number): Promise<boolean> => {
        try {
            const exists = await db.one(queries.transactions.checkTransactionExistsById, [transactionId]);
            return exists.exists;
        } catch (e) {
            throw e
        }
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