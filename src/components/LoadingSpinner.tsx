import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingSpinnerProps {
  message?: string;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(66, 133, 244, 0.2);
  border-top: 5px solid #4285f4;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: #666;
  text-align: center;
`;

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <SpinnerContainer>
      <Spinner />
      <Message>{message}</Message>
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
