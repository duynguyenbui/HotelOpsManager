import { TransactionStatus } from '@prisma/client';

export const getStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.COMPLETED:
      return 'bg-green-100 text-green-800';
    case TransactionStatus.PEDNING:
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
