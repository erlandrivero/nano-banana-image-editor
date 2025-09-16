import React from 'react';
import styled from 'styled-components';
import { FiX } from 'react-icons/fi';

interface ImagePreviewProps {
  imageUrl: string;
  onRemove?: () => void;
}

const ImageContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, onRemove }) => {
  return (
    <ImageContainer>
      <Image src={imageUrl} alt="Preview" />
      {onRemove && (
        <RemoveButton onClick={onRemove}>
          <FiX />
        </RemoveButton>
      )}
    </ImageContainer>
  );
};

export default ImagePreview;
