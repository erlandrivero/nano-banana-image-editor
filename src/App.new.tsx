import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiDownload, FiEdit, FiImage, FiSend, FiMagic } from 'react-icons/fi';

// Styled components
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  color: white;
  padding: 40px 20px;
`;

const HeaderTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const HeaderSubtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px;
  width: 100%;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  margin-bottom: 40px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const CardTitle = styled.h2`
  color: #667eea;
  margin-bottom: 20px;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CardDescription = styled.p`
  margin-bottom: 20px;
  color: #666;
`;

const UploadArea = styled.div<{ isDragActive: boolean }>`
  border: 3px dashed ${props => props.isDragActive ? '#764ba2' : '#667eea'};
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 20px;
  background-color: ${props => props.isDragActive ? '#f0f2ff' : 'transparent'};
  transform: ${props => props.isDragActive ? 'scale(1.02)' : 'scale(1)'};
  
  &:hover {
    border-color: #764ba2;
    background-color: #f8f9ff;
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 15px;
`;

const UploadText = styled.p`
  font-weight: bold;
  margin-bottom: 5px;
`;

const UploadSubText = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-top: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 15px;
  border: 2px solid #e1e5e9;
  border-radius: 15px;
  font-size: 1rem;
  margin-bottom: 20px;
  transition: border-color 0.3s ease;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonIcon = styled.span`
  display: flex;
  align-items: center;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 10px;
  margin-top: 15px;
  object-fit: cover;
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 15px;
  border-radius: 10px;
  margin-top: 15px;
`;

const SuccessMessage = styled.div`
  background: #efe;
  color: #363;
  padding: 15px;
  border-radius: 10px;
  margin-top: 15px;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ResultsSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  margin-top: 30px;
`;

const ResultsTitle = styled.h2`
  color: #667eea;
  margin-bottom: 20px;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ResultItem = styled.div`
  border: 1px solid #e1e5e9;
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const ResultImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
  border-radius: 10px 10px 0 0;
`;

const ResultInfo = styled.div`
  padding: 15px;
  background: #f8f9ff;
`;

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [sourceImageUrl, setSourceImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSourceImage(file);
      const imageUrl = URL.createObjectURL(file);
      setSourceImageUrl(imageUrl);
      setError(null);
      setSuccess(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });

  // Process image with Gemini 2.5 Flash Image (Nano Banana)
  const processImage = async () => {
    if (!sourceImage || !prompt) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show API information message
      setSuccess(
        "To use this application with the Gemini API, you need to:\n\n" +
        "1. Have a valid API key with sufficient quota\n" +
        "2. Be aware that the API may have rate limits\n\n" +
        "Your image would be sent to Google's servers for processing.\n\n" +
        "For now, this is a demonstration of the UI only."
      );
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AppContainer>
      <Header>
        <HeaderTitle>
          <FiMagic /> Gemini Image Editor
        </HeaderTitle>
        <HeaderSubtitle>Powered by Nano Banana (Gemini 2.5 Flash Image) 🍌</HeaderSubtitle>
      </Header>
      
      <MainContent>
        <CardGrid>
          <Card>
            <CardTitle>
              <FiEdit /> Image Manipulation
            </CardTitle>
            <CardDescription>
              Upload an image and describe how you want to modify it
            </CardDescription>
            
            {!sourceImageUrl ? (
              <UploadArea {...getRootProps()} isDragActive={isDragActive}>
                <input {...getInputProps()} />
                <UploadIcon>
                  <FiUpload />
                </UploadIcon>
                <UploadText>Click to upload or drag and drop your image here</UploadText>
                <UploadSubText>Supports JPG, PNG, GIF up to 10MB</UploadSubText>
              </UploadArea>
            ) : (
              <>
                <PreviewImage src={sourceImageUrl} alt="Preview" />
                <Button 
                  onClick={() => {
                    setSourceImage(null);
                    setSourceImageUrl(null);
                  }}
                  style={{ 
                    marginTop: '10px', 
                    background: 'transparent', 
                    color: '#667eea',
                    boxShadow: 'none',
                    padding: '5px 15px'
                  }}
                >
                  Remove Image
                </Button>
              </>
            )}
            
            <TextArea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe how you want to modify the image... (e.g., 'Add a rainbow in the background', 'Make it look like a vintage photo', 'Add sunglasses to the person')"
              disabled={!sourceImage || isProcessing}
            />
            
            <Button 
              onClick={processImage} 
              disabled={!sourceImage || !prompt || isProcessing}
            >
              <ButtonIcon><FiMagic /></ButtonIcon>
              {isProcessing ? 'Processing...' : 'Manipulate Image'}
            </Button>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}
          </Card>
          
          <Card>
            <CardTitle>
              <FiImage /> Generate New Image
            </CardTitle>
            <CardDescription>
              Describe an image and let AI create it for you
            </CardDescription>
            
            <TextArea
              placeholder="Describe the image you want to generate... (e.g., 'A futuristic city at sunset', 'A cat wearing a space helmet', 'A magical forest with glowing mushrooms')"
              disabled={isProcessing}
            />
            
            <Button disabled={isProcessing}>
              <ButtonIcon><FiMagic /></ButtonIcon>
              Generate Image
            </Button>
            
            <SuccessMessage style={{ display: 'block' }}>
              This feature requires the Gemini 2.5 Flash Image API. To use it:
              <br /><br />
              1. Get an API key from Google AI Studio
              <br />
              2. Add it to your .env file as GEMINI_API_KEY
              <br />
              3. Ensure you have sufficient quota
              <br /><br />
              For now, this is a demonstration of the UI only.
            </SuccessMessage>
          </Card>
        </CardGrid>
        
        {isProcessing && (
          <LoadingContainer>
            <Spinner />
            <h3>Processing with Nano Banana...</h3>
            <p>This may take a few moments</p>
          </LoadingContainer>
        )}
      </MainContent>
    </AppContainer>
  );
};

export default App;
