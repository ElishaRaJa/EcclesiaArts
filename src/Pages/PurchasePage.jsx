import React from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '../components/ui/Toast';
import PurchaseFlow from './PurchaseFlow';

const PurchasePage = () => {
  const { id } = useParams();
  const { showToast } = useToast();

  return <PurchaseFlow />;
};

export default PurchasePage;
