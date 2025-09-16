# Nano Banana Image Editor

A modern UI application that allows users to upload images and manipulate them using text prompts with the Gemini 2.5 Flash Image (Nano Banana) model. This application directly integrates with Google's Gemini API to provide powerful AI image manipulation capabilities.

## Features

- Upload images via drag-and-drop or file selection
- Manipulate images using natural language prompts
- Direct integration with Gemini 2.5 Flash Image (Nano Banana) API
- Download processed images
- Modern and responsive UI
- Exponential backoff retry mechanism for API rate limiting

## Technologies Used

- React
- TypeScript
- Styled Components
- Google Gemini API (@google/genai)
- React Dropzone for file uploads
- React Icons for UI elements

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- NPM or Yarn
- Gemini API Key (required)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

### Running the Application

```
npm start
```

The application will be available at `http://localhost:3000`.

### Building for Production

```
npm run build
```

## How to Use

1. Upload an image using the drag-and-drop area or by clicking to select a file
2. Enter a prompt describing how you want to manipulate the image
3. Click "Process with Nano Banana" to send your image to the Gemini API
4. Wait for the API to process your image (this may take a few seconds)
5. Download the processed image using the "Download Result" button

## Examples of Prompts

- "Add white hair to this portrait"
- "Make this image look like an oil painting"
- "Add a sunset background to this portrait"
- "Turn this person into a cartoon character"
- "Remove the background and replace it with a beach scene"
- "Make this image look like it was taken in the 1980s"

## About Nano Banana (Gemini 2.5 Flash Image)

Nano Banana is Google's state-of-the-art image generation and editing model released in August 2025. It offers capabilities such as:

- Maintaining character consistency across multiple images
- Prompt-based image editing with natural language
- Native world knowledge for more contextual understanding
- Multi-image fusion for combining elements from different images

All images created or edited with Gemini 2.5 Flash Image include an invisible SynthID digital watermark to identify them as AI-generated.

## API Usage Notes

This application directly uses the Gemini 2.5 Flash Image API. Please be aware of the following:

- You must have a valid API key with sufficient quota
- The API may have rate limits that can cause 429 errors
- The application includes retry logic with exponential backoff to handle rate limiting
- Your images are sent to Google's servers for processing
