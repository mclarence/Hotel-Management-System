import {Transaction} from "@hotel-management-system/models";

export const createTransaction = (transaction: Transaction): Promise<Response> => {
    return fetch('/api/transactions/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(transaction)
    })
}

export const getTransactions = (): Promise<Response> => {
    return fetch('/api/transactions', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

export const deleteTransaction = (transactionId: number): Promise<Response> => {
    return fetch(`/api/transactions/${transactionId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

export const updateTransaction = (transaction: Transaction): Promise<Response> => {
    const tempTransaction = {...transaction}
    delete tempTransaction.transactionId

    return fetch(`/api/transactions/${transaction.transactionId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(tempTransaction)
    })
}