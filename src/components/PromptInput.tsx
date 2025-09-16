import React, { KeyboardEvent } from 'react';
import styled from 'styled-components';
import { FiSend } from 'react-icons/fi';

interface PromptInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  padding-right: 3rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4285f4;
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background-color: transparent;
  color: #4285f4;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
  
  &:hover {
    color: #3367d6;
  }
  
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Enter your prompt...'
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey && !disabled) {
      onSubmit();
    }
  };

  return (
    <InputContainer>
      <TextArea
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
      />
      <SendButton
        onClick={onSubmit}
        disabled={disabled || !value.trim()}
        title="Send prompt (Ctrl+Enter)"
      >
        <FiSend />
      </SendButton>
    </InputContainer>
  );
};

export default PromptInput;
