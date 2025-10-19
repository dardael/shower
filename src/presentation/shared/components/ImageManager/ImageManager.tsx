'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Image,
  Spinner,
  createToaster,
} from '@chakra-ui/react';
import { FiUpload, FiTrash2, FiImage, FiRefreshCw } from 'react-icons/fi';
import {
  ImageManagerProps,
  ImageState,
  ValidationError,
  ImageMetadata,
} from './types';

export default function ImageManager({
  currentImage,
  config,
  labels,
  onImageUpload,
  onImageDelete,
  onImageReplace,
  onValidationError,
  disabled = false,
  loading = false,
  showFileSize = true,
  showFormatInfo = true,
  allowDelete = true,
  allowReplace = true,
}: ImageManagerProps) {
  const [imageState, setImageState] = useState<ImageState>(
    currentImage ? 'preview' : 'empty'
  );
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImage?.url || null
  );
  const [validationError, setValidationError] =
    useState<ValidationError | null>(null);
  const [imageError, setImageError] = useState(false);

  // Sync internal state with currentImage prop changes
  useEffect(() => {
    if (currentImage) {
      setImageState('preview');
      setPreviewUrl(currentImage.url);
      setImageError(false);
    } else {
      setImageState('empty');
      setPreviewUrl(null);
      setImageError(false);
    }
  }, [currentImage]);

  // Cleanup object URLs on unmount and when previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toaster = createToaster({
    placement: 'top-end',
  });

  // File validation
  const validateFile = useCallback(
    (file: File): ValidationError | null => {
      // File size validation
      if (file.size > config.maxFileSize) {
        return {
          type: 'SIZE',
          message: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds limit of ${(config.maxFileSize / 1024 / 1024).toFixed(2)}MB`,
        };
      }

      // File format validation
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !config.acceptedFormats.includes(fileExtension)) {
        return {
          type: 'FORMAT',
          message: `File format .${fileExtension} is not supported. Accepted formats: ${config.acceptedFormats.join(', ')}`,
        };
      }

      // MIME type validation
      if (!file.type.startsWith('image/')) {
        return {
          type: 'FORMAT',
          message: 'Only image files are allowed',
        };
      }

      return null;
    },
    [config]
  );

  // Generate image metadata
  const generateMetadata = useCallback((file: File): ImageMetadata => {
    return {
      filename: `${Date.now()}-${file.name}`,
      originalName: file.name,
      size: file.size,
      format: file.name.split('.').pop() || 'unknown',
      mimeType: file.type,
      uploadedAt: new Date(),
    };
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(
    async (file: File) => {
      // Reset states
      setValidationError(null);
      setImageState('uploading');

      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setValidationError(validationError);
        setImageState('error');
        onValidationError(validationError);
        return;
      }

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      try {
        // Generate metadata
        const metadata = generateMetadata(file);

        // Handle upload/replace
        if (currentImage && allowReplace) {
          await onImageReplace(file, metadata);
        } else {
          await onImageUpload(file, metadata);
        }

        // Cleanup object URL after successful upload
        URL.revokeObjectURL(objectUrl);

        setImageState('preview');
        toaster.create({
          title: currentImage
            ? 'Image replaced successfully'
            : 'Image uploaded successfully',
          type: 'success',
        });
      } catch (error) {
        const errorObj: ValidationError = {
          type: 'UPLOAD_FAILED',
          message: error instanceof Error ? error.message : 'Upload failed',
        };
        setValidationError(errorObj);
        setImageState('error');
        onValidationError(errorObj);
        URL.revokeObjectURL(objectUrl);
      }
    },
    [
      currentImage,
      allowReplace,
      validateFile,
      generateMetadata,
      onImageUpload,
      onImageReplace,
      onValidationError,
      toaster,
    ]
  );

  // Handle file delete
  const handleDelete = useCallback(async () => {
    setImageState('loading');
    try {
      await onImageDelete();
      setPreviewUrl(null);
      setImageState('empty');
      toaster.create({
        title: 'Image deleted successfully',
        type: 'success',
      });
    } catch (error) {
      const errorObj: ValidationError = {
        type: 'UPLOAD_FAILED',
        message: error instanceof Error ? error.message : 'Delete failed',
      };
      setValidationError(errorObj);
      setImageState('error');
      onValidationError(errorObj);
    }
  }, [onImageDelete, onValidationError, toaster]);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled || loading) return;

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        handleFileUpload(files[0]);
      }
    },
    [disabled, loading, handleFileUpload]
  );

  // Handle file input change
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files[0]) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  // Upload area component
  const UploadArea = () => (
    <Box
      borderWidth="2px"
      borderStyle="dashed"
      borderColor={dragActive ? 'colorPalette.solid' : 'border'}
      borderRadius="lg"
      p={8}
      textAlign="center"
      bg={dragActive ? 'colorPalette.subtle' : 'bg.subtle'}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      _hover={
        !disabled && !dragActive
          ? { borderColor: 'border.emphasized', bg: 'bg.muted' }
          : {}
      }
      onClick={() => !disabled && fileInputRef.current?.click()}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <VStack gap={4}>
        <FiImage size={48} color="fg.muted" />
        <VStack gap={2}>
          <Text fontWeight="medium" color="fg">
            {labels.dragDropText}
          </Text>
          <Text fontSize="sm" color="fg.muted">
            or click to browse
          </Text>
        </VStack>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          <FiUpload />
          {labels.uploadLabel}
        </Button>
        <VStack gap={1} fontSize="xs" color="fg.muted">
          {showFormatInfo && (
            <Text>
              Supported formats:{' '}
              {config.acceptedFormats.map((f) => f.toUpperCase()).join(', ')}
            </Text>
          )}
          <Text>
            Maximum file size: {(config.maxFileSize / 1024 / 1024).toFixed(1)}MB
          </Text>
        </VStack>
      </VStack>
    </Box>
  );

  // Preview area component
  const PreviewArea = () => (
    <VStack gap={4} align="start">
      <Box
        borderRadius="lg"
        overflow="hidden"
        border="1px solid"
        borderColor="border"
        bg="bg.subtle"
        width={config.previewSize?.width || '200px'}
        height={config.previewSize?.height || '200px'}
        position="relative"
      >
        {imageState === 'loading' && (
          <Box
            position="absolute"
            inset={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="bg.subtle/80"
            zIndex={10}
          >
            <Spinner size="lg" />
          </Box>
        )}

        {!imageError ? (
          <Image
            src={previewUrl || currentImage?.url}
            alt="Preview"
            width="100%"
            height="100%"
            objectFit="contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <Box
            width="100%"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="fg.muted"
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </Box>
        )}
      </Box>

      {/* Action buttons outside the preview area */}
      <HStack gap={2}>
        {allowReplace && (
          <Button
            size="sm"
            colorPalette="blue"
            variant="solid"
            disabled={disabled || loading}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Replace image"
          >
            <FiRefreshCw />
          </Button>
        )}
        {allowDelete && (
          <Button
            size="sm"
            colorPalette="red"
            variant="solid"
            disabled={disabled || loading}
            onClick={handleDelete}
            aria-label="Delete image"
          >
            <FiTrash2 />
          </Button>
        )}
      </HStack>

      <VStack gap={1} align="start" fontSize="sm">
        <Text fontWeight="medium" color="fg">
          {currentImage?.filename || 'Uploaded image'}
        </Text>
        {showFileSize && currentImage && (
          <Text color="fg.muted">
            Size: {(currentImage.size / 1024).toFixed(1)}KB
          </Text>
        )}
        {showFormatInfo && currentImage && (
          <Text color="fg.muted">
            Format: {currentImage.format.toUpperCase()}
          </Text>
        )}
      </VStack>
    </VStack>
  );

  // Error state component
  const ErrorState = () => (
    <Box
      borderWidth="2px"
      borderColor="red.border"
      borderRadius="lg"
      p={4}
      bg="red.subtle"
    >
      <VStack gap={2}>
        <Text color="red.fg" fontWeight="medium">
          Upload Error
        </Text>
        <Text color="red.fg" fontSize="sm">
          {validationError?.message}
        </Text>
        <Button
          size="sm"
          colorPalette="red"
          variant="outline"
          onClick={() => {
            setValidationError(null);
            setImageState(currentImage ? 'preview' : 'empty');
          }}
        >
          Try Again
        </Button>
      </VStack>
    </Box>
  );

  // Uploading state component
  const UploadingState = () => (
    <Box
      borderWidth="2px"
      borderColor="blue.border"
      borderRadius="lg"
      p={8}
      bg="blue.subtle"
      textAlign="center"
    >
      <VStack gap={4}>
        <Spinner size="lg" color="blue.fg" />
        <Text color="blue.fg" fontWeight="medium">
          Uploading image...
        </Text>
      </VStack>
    </Box>
  );

  return (
    <Box>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={config.acceptedFormats.map((format) => `.${format}`).join(',')}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {/* Render appropriate state */}
      {imageState === 'empty' && <UploadArea />}
      {imageState === 'uploading' && <UploadingState />}
      {imageState === 'preview' && <PreviewArea />}
      {imageState === 'error' && <ErrorState />}
      {imageState === 'loading' && <UploadingState />}
    </Box>
  );
}
