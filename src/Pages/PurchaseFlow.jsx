import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stepper, Step, StepLabel, Button } from '@mui/material';
import ArtworkStep from './PurchaseFlow/ArtworkStep';
import UserInfoStep from './PurchaseFlow/UserInfoStep';
import DeliveryStep from './PurchaseFlow/DeliveryStep';

const steps = ['Artwork Details', 'Shipping & Billing', 'Delivery Options'];

const PurchaseFlow = () => {
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [userData, setUserData] = useState(null);
  const [shippingData, setShippingData] = useState(null);

  const handleNext = (data) => {
    if (data?.shippingRate) {
      setShippingData(data);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleUserDataUpdate = (data) => {
    setUserData(data);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <ArtworkStep artworkId={id} onNext={handleNext} />;
      case 1:
        return (
          <UserInfoStep 
            initialData={userData}
            onUpdate={handleUserDataUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <DeliveryStep 
            userData={userData} 
            artworkId={id} 
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      default:
        throw new Error('Unknown step');
    }
  };

  return (
    <Box sx={{ width: '100%', p: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {getStepContent(activeStep)}
    </Box>
  );
};

export default PurchaseFlow;
