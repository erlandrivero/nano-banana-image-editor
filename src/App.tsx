import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiDownload, FiEdit, FiImage, FiSend, FiZap } from 'react-icons/fi';
import { GoogleGenAI } from '@google/genai';

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

// Create a base styled component without props
const BaseUploadArea = styled.div`
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 20px;
  
  &:hover {
    border-color: #764ba2;
    background-color: #f8f9ff;
  }
`;

// Create a wrapper component that handles the isDragActive prop and forwards refs
const UploadArea = React.forwardRef<HTMLDivElement, { isDragActive: boolean } & React.HTMLAttributes<HTMLDivElement>>(
  ({ isDragActive, ...props }, ref) => (
    <BaseUploadArea 
      ref={ref}
      style={{
        border: `3px dashed ${isDragActive ? '#764ba2' : '#667eea'}`,
        backgroundColor: isDragActive ? '#f0f2ff' : 'transparent',
        transform: isDragActive ? 'scale(1.02)' : 'scale(1)'
      }}
      {...props}
    />
  )
);

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
  // Image manipulation state
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [sourceImageUrl, setSourceImageUrl] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Text-to-image generation state
  const [textToImagePrompt, setTextToImagePrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isTextToImageProcessing, setIsTextToImageProcessing] = useState<boolean>(false);
  const [textToImageError, setTextToImageError] = useState<string | null>(null);
  const [textToImageSuccess, setTextToImageSuccess] = useState<string | null>(null);
  
  // Image combination state
  const [firstImage, setFirstImage] = useState<File | null>(null);
  const [firstImageUrl, setFirstImageUrl] = useState<string | null>(null);
  const [secondImage, setSecondImage] = useState<File | null>(null);
  const [secondImageUrl, setSecondImageUrl] = useState<string | null>(null);
  const [combinationPrompt, setCombinationPrompt] = useState<string>('');
  const [combinedImage, setCombinedImage] = useState<string | null>(null);
  const [isCombiningImages, setIsCombiningImages] = useState<boolean>(false);
  const [combinationError, setCombinationError] = useState<string | null>(null);
  const [combinationSuccess, setCombinationSuccess] = useState<string | null>(null);

  // Handle file drop for image manipulation
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
  
  // Handle file drop for first image in combination
  const onDropFirstImage = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFirstImage(file);
      const imageUrl = URL.createObjectURL(file);
      setFirstImageUrl(imageUrl);
      setCombinationError(null);
      setCombinationSuccess(null);
    }
  }, []);

  const { getRootProps: getFirstImageRootProps, getInputProps: getFirstImageInputProps, isDragActive: isFirstImageDragActive } = useDropzone({
    onDrop: onDropFirstImage,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });
  
  // Handle file drop for second image in combination
  const onDropSecondImage = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSecondImage(file);
      const imageUrl = URL.createObjectURL(file);
      setSecondImageUrl(imageUrl);
      setCombinationError(null);
      setCombinationSuccess(null);
    }
  }, []);

  const { getRootProps: getSecondImageRootProps, getInputProps: getSecondImageInputProps, isDragActive: isSecondImageDragActive } = useDropzone({
    onDrop: onDropSecondImage,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });

  // Generate image from text with Gemini 2.5 Flash Image (Nano Banana)
  const generateImage = async () => {
    if (!textToImagePrompt) return;

    setIsTextToImageProcessing(true);
    setTextToImageError(null);
    setTextToImageSuccess(null);
    setGeneratedImage(null);

    try {
      // Get API key from environment variable
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not set');
      }

      // Initialize Google Genai client
      const ai = new GoogleGenAI({
        apiKey
      });

      // Configure the model request
      const model = 'gemini-2.5-flash-image-preview';
      
      // Create the prompt array with text only
      const promptArray = [
        { text: textToImagePrompt }
      ];
      
      try {
        // Add a small delay before making the request to help with rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await ai.models.generateContent({
          model,
          contents: promptArray
        });
        
        console.log('API Response received:', response);
        
        // Process the response according to official documentation
        if (response.candidates && response.candidates[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            console.log('Response part:', part);
            if (part.inlineData) {
              const imageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
              setGeneratedImage(imageData);
              setTextToImageSuccess('Image successfully generated with Nano Banana!');
            } else if (part.text) {
              console.log('Text response:', part.text);
              setTextToImageSuccess(`Image generated! ${part.text}`);
            }
          }
        } else {
          setTextToImageError('Received an empty response from the API');
        }
      } catch (apiError: any) {
        console.error('API Error:', apiError);
        
        // Safely extract error details
        const errorDetails = {
          name: apiError?.name || 'Unknown',
          message: apiError?.message || 'Unknown error',
          status: apiError?.status || 'Unknown status'
        };
        console.error('Error details:', errorDetails);
        
        // Check if it's a rate limit error
        const isRateLimit = errorDetails.status === 429 || 
                          (typeof errorDetails.message === 'string' && 
                           errorDetails.message.includes('429'));
        
        if (isRateLimit) {
          setTextToImageError(`Rate limit exceeded. Please try again in a few moments.`);
        } else {
          setTextToImageError(`API Error: ${errorDetails.message}`);
        }
      }
    } catch (err: any) {
      console.error('Error:', err);
      setTextToImageError(err.message || 'An error occurred');
    } finally {
      setIsTextToImageProcessing(false);
    }
  };

  // Combine two images with Gemini 2.5 Flash Image (Nano Banana)
  const combineImages = async () => {
    if (!firstImage || !secondImage || !combinationPrompt) return;

    setIsCombiningImages(true);
    setCombinationError(null);
    setCombinationSuccess(null);
    setCombinedImage(null);

    try {
      // Get API key from environment variable
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not set');
      }

      // Initialize Google Genai client
      const ai = new GoogleGenAI({
        apiKey
      });

      // Read the first image file as base64
      const firstReader = new FileReader();
      
      firstReader.onload = async () => {
        try {
          const firstBase64Image = (firstReader.result as string).split(',')[1];
          
          // Read the second image file as base64
          const secondReader = new FileReader();
          
          secondReader.onload = async () => {
            try {
              const secondBase64Image = (secondReader.result as string).split(',')[1];
              
              // Configure the model request
              const model = 'gemini-2.5-flash-image-preview';
              
              // Create the prompt array with text and both images
              const promptArray = [
                { text: combinationPrompt },
                { 
                  inlineData: { 
                    mimeType: firstImage.type, 
                    data: firstBase64Image 
                  } 
                },
                { 
                  inlineData: { 
                    mimeType: secondImage.type, 
                    data: secondBase64Image 
                  } 
                }
              ];
              
              try {
                // Add a small delay before making the request to help with rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const response = await ai.models.generateContent({
                  model,
                  contents: promptArray
                });
                
                console.log('API Response received:', response);
                
                // Process the response according to official documentation
                if (response.candidates && response.candidates[0]?.content?.parts) {
                  for (const part of response.candidates[0].content.parts) {
                    console.log('Response part:', part);
                    if (part.inlineData) {
                      const imageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                      setCombinedImage(imageData);
                      setCombinationSuccess('Images successfully combined with Nano Banana!');
                    } else if (part.text) {
                      console.log('Text response:', part.text);
                      setCombinationSuccess(`Images combined! ${part.text}`);
                    }
                  }
                } else {
                  setCombinationError('Received an empty response from the API');
                }
              } catch (apiError: any) {
                console.error('API Error:', apiError);
                
                // Safely extract error details
                const errorDetails = {
                  name: apiError?.name || 'Unknown',
                  message: apiError?.message || 'Unknown error',
                  status: apiError?.status || 'Unknown status'
                };
                console.error('Error details:', errorDetails);
                
                // Check if it's a rate limit error
                const isRateLimit = errorDetails.status === 429 || 
                                  (typeof errorDetails.message === 'string' && 
                                   errorDetails.message.includes('429'));
                
                if (isRateLimit) {
                  setCombinationError(`Rate limit exceeded. Please try again in a few moments.`);
                } else {
                  setCombinationError(`API Error: ${errorDetails.message}`);
                }
              }
            } catch (err: any) {
              console.error('Error processing second image:', err);
              setCombinationError(err.message || 'Failed to process second image');
            } finally {
              setIsCombiningImages(false);
            }
          };
          
          secondReader.onerror = () => {
            setCombinationError('Failed to read second image file');
            setIsCombiningImages(false);
          };
          
          secondReader.readAsDataURL(secondImage);
        } catch (err: any) {
          console.error('Error processing first image:', err);
          setCombinationError(err.message || 'Failed to process first image');
          setIsCombiningImages(false);
        }
      };
      
      firstReader.onerror = () => {
        setCombinationError('Failed to read first image file');
        setIsCombiningImages(false);
      };
      
      firstReader.readAsDataURL(firstImage);
    } catch (err: any) {
      console.error('Error:', err);
      setCombinationError(err.message || 'An error occurred');
      setIsCombiningImages(false);
    }
  };

  // Process image with Gemini 2.5 Flash Image (Nano Banana)
  const processImage = async () => {
    if (!sourceImage || !prompt) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      // Get API key from environment variable
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not set');
      }

      // Initialize Google Genai client
      const ai = new GoogleGenAI({
        apiKey
      });

      // Read the image file as base64
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const base64Image = (reader.result as string).split(',')[1];
          
          // Configure the model request
          const model = 'gemini-2.5-flash-image-preview';
          
          // Create the prompt array with text and image
          const promptArray = [
            { text: prompt },
            { 
              inlineData: { 
                mimeType: sourceImage.type, 
                data: base64Image 
              } 
            }
          ];
          
          // Call the API with the correct format
          try {
            // Add a small delay before making the request to help with rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const response = await ai.models.generateContent({
              model,
              contents: promptArray
            });
            
            console.log('API Response received:', response);
            
            // Process the response according to official documentation
            if (response.candidates && response.candidates[0]?.content?.parts) {
              for (const part of response.candidates[0].content.parts) {
                console.log('Response part:', part);
                if (part.inlineData) {
                  const imageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                  setResultImage(imageData);
                  setSuccess('Image successfully processed with Nano Banana!');
                } else if (part.text) {
                  console.log('Text response:', part.text);
                  setSuccess(`Image processed! ${part.text}`);
                }
              }
            } else {
              setError('Received an empty response from the API');
            }
          } catch (apiError: any) {
            console.error('API Error:', apiError);
            
            // Safely extract error details
            const errorDetails = {
              name: apiError?.name || 'Unknown',
              message: apiError?.message || 'Unknown error',
              status: apiError?.status || 'Unknown status'
            };
            console.error('Error details:', errorDetails);
            
            // Check if it's a rate limit error
            const isRateLimit = errorDetails.status === 429 || 
                              (typeof errorDetails.message === 'string' && 
                               errorDetails.message.includes('429'));
            
            if (isRateLimit) {
              setError(`Rate limit exceeded. Please try again in a few moments.`);
            } else {
              setError(`API Error: ${errorDetails.message}`);
            }
          }
        } catch (err: any) {
          console.error('Error processing image:', err);
          setError(err.message || 'Failed to process image');
        } finally {
          setIsProcessing(false);
        }
      };
      
      reader.onerror = () => {
        setError('Failed to read image file');
        setIsProcessing(false);
      };
      
      reader.readAsDataURL(sourceImage);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred');
      setIsProcessing(false);
    }
  };

  return (
    <AppContainer>
      <Header>
        <HeaderTitle>
          <FiZap /> Gemini Image Editor
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
              <ButtonIcon><FiZap /></ButtonIcon>
              {isProcessing ? 'Processing...' : 'Manipulate Image'}
            </Button>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}
          </Card>
          
          <Card>
            <CardTitle>
              <FiImage /> Result
            </CardTitle>
            <CardDescription>
              View the processed image
            </CardDescription>
            
            {isProcessing ? (
              <LoadingContainer>
                <Spinner />
                <h3>Processing with Nano Banana...</h3>
                <p>This may take a few moments</p>
              </LoadingContainer>
            ) : resultImage ? (
              <>
                <PreviewImage src={resultImage} alt="Result" />
                <Button 
                  onClick={() => {
                    // Download the result image
                    const link = document.createElement('a');
                    link.href = resultImage;
                    link.download = `nano-banana-result-${Date.now()}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  style={{ marginTop: '1rem' }}
                >
                  <ButtonIcon><FiDownload /></ButtonIcon>
                  Download Result
                </Button>
              </>
            ) : error ? (
              <ErrorMessage>{error}</ErrorMessage>
            ) : success ? (
              <SuccessMessage>{success}</SuccessMessage>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '3rem',
                color: '#666'
              }}>
                <p>Upload an image and enter a prompt to see the result here</p>
              </div>
            )}
          </Card>
        </CardGrid>
        
        <CardGrid style={{ marginTop: '30px' }}>
          <Card>
            <CardTitle>
              <FiZap /> Generate New Image
            </CardTitle>
            <CardDescription>
              Describe an image and let AI create it for you
            </CardDescription>
            
            <TextArea
              value={textToImagePrompt}
              onChange={(e) => setTextToImagePrompt(e.target.value)}
              placeholder="Describe the image you want to generate... (e.g., 'A futuristic city at sunset', 'A cat wearing a space helmet', 'A magical forest with glowing mushrooms')"
              disabled={isTextToImageProcessing}
            />
            
            <Button 
              onClick={generateImage} 
              disabled={!textToImagePrompt || isTextToImageProcessing}
            >
              <ButtonIcon><FiZap /></ButtonIcon>
              {isTextToImageProcessing ? 'Generating...' : 'Generate Image'}
            </Button>
            
            {textToImageError && <ErrorMessage>{textToImageError}</ErrorMessage>}
            {textToImageSuccess && <SuccessMessage>{textToImageSuccess}</SuccessMessage>}
          </Card>
          
          <Card>
            <CardTitle>
              <FiImage /> Generated Result
            </CardTitle>
            <CardDescription>
              View the generated image
            </CardDescription>
            
            {isTextToImageProcessing ? (
              <LoadingContainer>
                <Spinner />
                <h3>Generating with Nano Banana...</h3>
                <p>This may take a few moments</p>
              </LoadingContainer>
            ) : generatedImage ? (
              <>
                <PreviewImage src={generatedImage} alt="Generated Result" />
                <Button 
                  onClick={() => {
                    // Download the generated image
                    const link = document.createElement('a');
                    link.href = generatedImage;
                    link.download = `nano-banana-generated-${Date.now()}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  style={{ marginTop: '1rem' }}
                >
                  <ButtonIcon><FiDownload /></ButtonIcon>
                  Download Generated Image
                </Button>
              </>
            ) : textToImageError ? (
              <ErrorMessage>{textToImageError}</ErrorMessage>
            ) : textToImageSuccess ? (
              <SuccessMessage>{textToImageSuccess}</SuccessMessage>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '3rem',
                color: '#666'
              }}>
                <p>Enter a prompt to generate an image</p>
              </div>
            )}
          </Card>
        </CardGrid>
        
        <CardGrid style={{ marginTop: '30px' }}>
          <Card>
            <CardTitle>
              <FiEdit /> Combine Images
            </CardTitle>
            <CardDescription>
              Upload two images and describe how to combine them
            </CardDescription>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                {!firstImageUrl ? (
                  <UploadArea {...getFirstImageRootProps()} isDragActive={isFirstImageDragActive}>
                    <input {...getFirstImageInputProps()} />
                    <UploadIcon>
                      <FiUpload />
                    </UploadIcon>
                    <UploadText>First Image</UploadText>
                    <UploadSubText>Click to upload</UploadSubText>
                  </UploadArea>
                ) : (
                  <>
                    <PreviewImage src={firstImageUrl} alt="First Image" />
                    <Button 
                      onClick={() => {
                        setFirstImage(null);
                        setFirstImageUrl(null);
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
              </div>
              
              <div>
                {!secondImageUrl ? (
                  <UploadArea {...getSecondImageRootProps()} isDragActive={isSecondImageDragActive}>
                    <input {...getSecondImageInputProps()} />
                    <UploadIcon>
                      <FiUpload />
                    </UploadIcon>
                    <UploadText>Second Image</UploadText>
                    <UploadSubText>Click to upload</UploadSubText>
                  </UploadArea>
                ) : (
                  <>
                    <PreviewImage src={secondImageUrl} alt="Second Image" />
                    <Button 
                      onClick={() => {
                        setSecondImage(null);
                        setSecondImageUrl(null);
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
              </div>
            </div>
            
            <TextArea
              value={combinationPrompt}
              onChange={(e) => setCombinationPrompt(e.target.value)}
              placeholder="Describe how to combine the images... (e.g., 'Create a seamless blend of these two images', 'Put the subject from image 1 into the background of image 2')"
              disabled={!firstImage || !secondImage || isCombiningImages}
            />
            
            <Button 
              onClick={combineImages} 
              disabled={!firstImage || !secondImage || !combinationPrompt || isCombiningImages}
            >
              <ButtonIcon><FiZap /></ButtonIcon>
              {isCombiningImages ? 'Combining...' : 'Combine Images'}
            </Button>
            
            {combinationError && <ErrorMessage>{combinationError}</ErrorMessage>}
            {combinationSuccess && <SuccessMessage>{combinationSuccess}</SuccessMessage>}
          </Card>
          
          <Card>
            <CardTitle>
              <FiImage /> Combined Result
            </CardTitle>
            <CardDescription>
              View the combined image
            </CardDescription>
            
            {isCombiningImages ? (
              <LoadingContainer>
                <Spinner />
                <h3>Combining images with Nano Banana...</h3>
                <p>This may take a few moments</p>
              </LoadingContainer>
            ) : combinedImage ? (
              <>
                <PreviewImage src={combinedImage} alt="Combined Result" />
                <Button 
                  onClick={() => {
                    // Download the combined image
                    const link = document.createElement('a');
                    link.href = combinedImage;
                    link.download = `nano-banana-combined-${Date.now()}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  style={{ marginTop: '1rem' }}
                >
                  <ButtonIcon><FiDownload /></ButtonIcon>
                  Download Combined Image
                </Button>
              </>
            ) : combinationError ? (
              <ErrorMessage>{combinationError}</ErrorMessage>
            ) : combinationSuccess ? (
              <SuccessMessage>{combinationSuccess}</SuccessMessage>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '3rem',
                color: '#666'
              }}>
                <p>Upload two images and enter a prompt to combine them</p>
              </div>
            )}
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
