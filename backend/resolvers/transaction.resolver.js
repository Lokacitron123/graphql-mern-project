import Transaction from "../models/transaction.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (context.getUser()) {
          throw new Error("Unauthorized");
        }

        const userId = await context.getUser()._id;

        const transactions = await Transaction.find({ userId: userId }); // find all transactions related to this userId

        return transactions;
      } catch (error) {
        console.error("Error getting transactions", error);
        throw new Error("Error getting transactions");
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (error) {
        console.error("Error getting the transaction", error);
        throw new Error("Error getting the transaction");
      }
    },
    // TODO => ADD categoryStatistics query
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transaction({
          ...input,
          userId: context.getUSer()._id,
        });

        await newTransaction.save();
      } catch (error) {
        console.error("Error creating transaction", error);
        throw new Error("Error creating transaction");
      }
    },
    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );

        return updatedTransaction;
      } catch (error) {
        console.error("Error updated transaction", error);
        throw new Error("Error updated transaction");
      }
    },
    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );

        return deletedTransaction;
      } catch (error) {
        console.error("Error deleting transaction", error);
        throw new Error("Error deleting transaction");
      }
    },
  },
  // TODO => Add transaction/user relationship
};

export default transactionResolver;
