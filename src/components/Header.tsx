import React from 'react';
import styled from 'styled-components';
import { FiImage } from 'react-icons/fi';

const HeaderContainer = styled.header`
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoIcon = styled.div`
  font-size: 1.5rem;
  color: #4285f4;
  display: flex;
  align-items: center;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const Tagline = styled.p`
  color: #666;
  font-size: 0.875rem;
  margin: 0;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>
          <LogoIcon>
            <FiImage />
          </LogoIcon>
          <LogoText>Nano Banana</LogoText>
        </Logo>
        <Tagline>Image Manipulation with Gemini 2.5 Flash Image</Tagline>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
