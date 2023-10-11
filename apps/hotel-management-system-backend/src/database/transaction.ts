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

/**
 * Transaction DAO
 * @param db - database object
 */
export const makeTransactionsDAO = (db: IDatabase<any, any>): ITransactionDAO => {

    /**
     * Get all transactions
     * @returns transactions, empty array if no transactions
     */
    const getTransactions = async (): Promise<Transaction[]> => {
        return await db.any(queries.transactions.getTransactions);
    }

    /**
     * Get transaction by id
     * @param transactionId
     * @returns transaction, null if no transaction
     */
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

    /**
     * Create transaction
     * @param transaction
     * @returns transaction
     */
    const createTransaction = async (transaction: Transaction): Promise<Transaction> => {
        return await db.one(queries.transactions.addTransaction, [transaction.paymentMethodId, transaction.guestId, transaction.amount, transaction.description, transaction.date]);
    }

    /**
     * Update transaction
     * @param transaction
     * @returns transaction
     */
    const updateTransaction = async (transaction: Transaction): Promise<Transaction> => {
        return await db.one(queries.transactions.updateTransaction, [transaction.paymentMethodId, transaction.guestId, transaction.amount, transaction.description, transaction.date, transaction.transactionId]);
    }

    /**
     * Delete transaction
     * @param transactionId
     * @returns transaction
     */
    const deleteTransaction = async (transactionId: number): Promise<Transaction> => {
        return await db.none(queries.transactions.deleteTransaction, [transactionId]);
    }

    /**
     * Check if transaction exists by id
     * @param transactionId
     * @returns boolean
     */
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