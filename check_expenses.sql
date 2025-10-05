SELECT ExpenseId, UserId, AmountEncrypted, Department, DateConsumed, Description, ExpenseType, LinkedCashRequestId, CreatedAt
FROM Expenses
ORDER BY ExpenseId DESC
LIMIT 10;