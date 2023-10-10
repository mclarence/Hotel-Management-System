import {PaymentMethod} from "@hotel-management-system/models";
import pgPromise, {IDatabase} from "pg-promise";
import queries from "./sql/queries";
import QueryResultError = pgPromise.errors.QueryResultError;

export interface IPaymentMethodsDAO {
    getPaymentMethods(): Promise<PaymentMethod[]>;
    getPaymentMethodById(paymentMethodId: number): Promise<PaymentMethod>;
    addPaymentMethod(paymentMethod: PaymentMethod): Promise<PaymentMethod>;
    updatePaymentMethod(paymentMethod: PaymentMethod): Promise<PaymentMethod>;
    deletePaymentMethod(paymentMethodId: number): Promise<void>;
    checkPaymentMethodExistsById(paymentMethodId: number): Promise<boolean>;
}

export const makePaymentMethodsDAO = (db: IDatabase<any, any>): IPaymentMethodsDAO => {
    const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
        try {
            const paymentMethods = await db.any(queries.paymentMethods.getPaymentMethods);
            return paymentMethods;
        } catch (error) {
            throw error;
        }
    }

    const getPaymentMethodById = async (paymentMethodId: number): Promise<PaymentMethod | null> => {
        try {
            const paymentMethod = await db.one(queries.paymentMethods.getPaymentMethodById, [paymentMethodId]);
            return paymentMethod;
        } catch (error) {
            if (error instanceof QueryResultError && error.code === pgPromise.errors.queryResultErrorCode.noData) {
                return null
            }
            throw error;
        }
    }

    const addPaymentMethod = async (paymentMethod: PaymentMethod): Promise<PaymentMethod> => {
        try {
            const newPaymentMethod = await db.one(queries.paymentMethods.addPaymentMethod, [paymentMethod.guestId, paymentMethod.type, paymentMethod.cardNumber, paymentMethod.cardCVV, paymentMethod.cardExpiration, paymentMethod.cardHolderName, paymentMethod.bankAccountNumber, paymentMethod.bankBSB]);
            return newPaymentMethod;
        } catch (error) {
            throw error;
        }
    }

    const updatePaymentMethod = async (paymentMethod: PaymentMethod): Promise<PaymentMethod> => {
        try {
            const updatedPaymentMethod = await db.one(queries.paymentMethods.updatePaymentMethod, [paymentMethod.guestId, paymentMethod.type, paymentMethod.cardNumber, paymentMethod.cardCVV, paymentMethod.cardExpiration, paymentMethod.cardHolderName, paymentMethod.bankAccountNumber, paymentMethod.bankBSB, paymentMethod.paymentMethodId]);
            return updatedPaymentMethod;
        } catch (error) {
            throw error;
        }
    }

    const deletePaymentMethod = async (paymentMethodId: number): Promise<void> => {
        try {
            await db.none(queries.paymentMethods.deletePaymentMethod, [paymentMethodId]);
        } catch (error) {
            throw error;
        }
    }

    const checkPaymentMethodExistsById = async (paymentMethodId: number): Promise<boolean> => {
        try {
            const exists = await db.one(queries.paymentMethods.checkPaymentMethodExistsById, [paymentMethodId]);
            return exists.exists;
        } catch (error) {
            throw error;
        }
    }

    return {
        getPaymentMethods,
        getPaymentMethodById,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        checkPaymentMethodExistsById,
    }
}