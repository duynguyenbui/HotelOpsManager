import React from 'react';

const CheckoutPage = ({ params }: { params: { id: string } }) => {
  return <div>CheckoutPage # {params.id}</div>;
};

export default CheckoutPage;
