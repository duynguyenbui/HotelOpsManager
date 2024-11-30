import React from 'react';

const TransactionIdPage = ({ params }: { params: { id: string } }) => {
  return <div>TransactionIdPage # {params.id}</div>;
};

export default TransactionIdPage;
