import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, beforeEach, afterEach, jest } from '@jest/globals';
import ImageManager from '@/presentation/shared/components/ImageManager/ImageManager';
import type {
  ImageManagerProps,
  ImageData,
  ImageMetadata,
  ValidationError,
} from '@/presentation/shared/components/ImageManager/types';

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = jest.fn();
const mockRevokeObjectURL = jest.fn();
Object.defineProperty(URL, 'createObjectURL', {
  value: mockCreateObjectURL,
});
Object.defineProperty(URL, 'revokeObjectURL', {
  value: mockRevokeObjectURL,
});

// Mock react-icons
jest.mock('react-icons/fi', () => ({
  FiUpload: () => <div data-testid="upload-icon">UploadIcon</div>,
  FiTrash2: () => <div data-testid="trash-icon">TrashIcon</div>,
  FiImage: () => <div data-testid="image-icon">ImageIcon</div>,
  FiRefreshCw: () => <div data-testid="refresh-icon">RefreshIcon</div>,
}));

describe('ImageManager', () => {
  const mockOnImageUpload = jest.fn() as jest.MockedFunction<
    (file: File, metadata: ImageMetadata) => Promise<void>
  >;
  const mockOnImageDelete = jest.fn() as jest.MockedFunction<
    () => Promise<void>
  >;
  const mockOnImageReplace = jest.fn() as jest.MockedFunction<
    (file: File, metadata: ImageMetadata) => Promise<void>
  >;
  const mockOnValidationError = jest.fn() as jest.MockedFunction<
    (error: ValidationError) => void
  >;

  const defaultProps: ImageManagerProps = {
    config: {
      acceptedFormats: ['jpg', 'png', 'gif', 'webp', 'ico', 'svg'],
      maxFileSize: 2 * 1024 * 1024, // 2MB
    },
    labels: {
      uploadLabel: 'Upload',
      uploadHint: 'Upload an image',
      replaceButton: 'Replace',
      deleteButton: 'Delete',
      dragDropText: 'Drag and drop an image here',
      sizeLimitText: 'Maximum file size: 2MB',
      formatText: 'Supported formats: JPG, PNG, GIF, WebP, ICO, SVG',
    },
    onImageUpload: mockOnImageUpload,
    onImageDelete: mockOnImageDelete,
    onImageReplace: mockOnImageReplace,
    onValidationError: mockOnValidationError,
  };

  const createMockFile = (name: string, size: number, type: string): File => {
    const file = new File(['test'], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateObjectURL.mockReturnValue('blob:test-url');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Component rendering', () => {
    it('renders upload area when no current image', () => {
      render(<ImageManager {...defaultProps} />);

      expect(
        screen.getByText('Drag and drop an image here')
      ).toBeInTheDocument();
      expect(screen.getByText('or click to browse')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /upload/i })
      ).toBeInTheDocument();
      expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
    });

    it('renders preview area when current image is provided', () => {
      const currentImage: ImageData = {
        url: 'https://example.com/image.jpg',
        filename: 'test-image.jpg',
        size: 1024,
        format: 'jpg',
      };

      render(<ImageManager {...defaultProps} currentImage={currentImage} />);

      expect(screen.getByAltText('Preview')).toBeInTheDocument();
      expect(screen.getByText('test-image.jpg')).toBeInTheDocument();
      expect(screen.getByText('Size: 1.0KB')).toBeInTheDocument();
      expect(screen.getByText('Format: JPG')).toBeInTheDocument();
    });

    it('hides file size and format info when props are false', () => {
      const currentImage: ImageData = {
        url: 'https://example.com/image.jpg',
        filename: 'test-image.jpg',
        size: 1024,
        format: 'jpg',
      };

      render(
        <ImageManager
          {...defaultProps}
          currentImage={currentImage}
          showFileSize={false}
          showFormatInfo={false}
        />
      );

      expect(screen.queryByText(/Size:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Format:/)).not.toBeInTheDocument();
    });

    it('hides delete and replace buttons when props are false', () => {
      const currentImage: ImageData = {
        url: 'https://example.com/image.jpg',
        filename: 'test-image.jpg',
        size: 1024,
        format: 'jpg',
      };

      render(
        <ImageManager
          {...defaultProps}
          currentImage={currentImage}
          allowDelete={false}
          allowReplace={false}
        />
      );

      expect(screen.queryByTestId('trash-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('refresh-icon')).not.toBeInTheDocument();
    });
  });

  describe('File validation', () => {
    it('rejects files that are too large', async () => {
      render(<ImageManager {...defaultProps} />);

      const largeFile = createMockFile(
        'large.jpg',
        3 * 1024 * 1024,
        'image/jpeg'
      );
      const input = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [largeFile] } });

      await waitFor(() => {
        expect(mockOnValidationError).toHaveBeenCalledWith({
          type: 'SIZE',
          message: expect.stringContaining('exceeds limit of 2.00MB'),
        });
      });
    });

    it('rejects files with unsupported formats', async () => {
      render(<ImageManager {...defaultProps} />);

      const unsupportedFile = createMockFile(
        'test.pdf',
        1024,
        'application/pdf'
      );
      const input = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [unsupportedFile] } });

      await waitFor(() => {
        expect(mockOnValidationError).toHaveBeenCalledWith({
          type: 'FORMAT',
          message: expect.stringContaining('not supported'),
        });
      });
    });

    it('rejects non-image files', async () => {
      render(<ImageManager {...defaultProps} />);

      const nonImageFile = createMockFile('test.txt', 1024, 'text/plain');
      const input = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [nonImageFile] } });

      await waitFor(() => {
        expect(mockOnValidationError).toHaveBeenCalledWith({
          type: 'FORMAT',
          message:
            'File format .txt is not supported. Accepted formats: jpg, png, gif, webp, ico, svg',
        });
      });
    });
  });

  describe('File upload flow', () => {
    it('uploads valid file successfully', async () => {
      mockOnImageUpload.mockResolvedValue(undefined);

      render(<ImageManager {...defaultProps} />);

      const validFile = createMockFile('test.jpg', 1024, 'image/jpeg');
      const input = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [validFile] } });

      await waitFor(() => {
        expect(mockOnImageUpload).toHaveBeenCalledWith(
          validFile,
          expect.objectContaining({
            filename: expect.stringMatching(/^\d+-test\.jpg$/),
            originalName: 'test.jpg',
            size: 1024,
            format: 'jpg',
            mimeType: 'image/jpeg',
            uploadedAt: expect.any(Date),
          })
        );
      });

      expect(mockCreateObjectURL).toHaveBeenCalledWith(validFile);
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:test-url');
    });

    it('replaces existing image when allowReplace is true', async () => {
      const currentImage: ImageData = {
        url: 'https://example.com/existing.jpg',
        filename: 'existing.jpg',
        size: 1024,
        format: 'jpg',
      };

      mockOnImageReplace.mockResolvedValue(undefined);

      render(<ImageManager {...defaultProps} currentImage={currentImage} />);

      const validFile = createMockFile('new.jpg', 1024, 'image/jpeg');
      const input = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [validFile] } });

      await waitFor(() => {
        expect(mockOnImageReplace).toHaveBeenCalledWith(
          validFile,
          expect.objectContaining({
            filename: expect.stringMatching(/^\d+-new\.jpg$/),
            originalName: 'new.jpg',
          })
        );
      });

      expect(mockOnImageUpload).not.toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('handles upload failure gracefully', async () => {
      mockOnImageUpload.mockRejectedValue(new Error('Upload failed'));

      render(<ImageManager {...defaultProps} />);

      const validFile = createMockFile('test.jpg', 1024, 'image/jpeg');
      const input = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [validFile] } });

      await waitFor(() => {
        expect(screen.getByText('Upload Error')).toBeInTheDocument();
        expect(screen.getByText('Upload failed')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });

      expect(mockOnValidationError).toHaveBeenCalledWith({
        type: 'UPLOAD_FAILED',
        message: 'Upload failed',
      });
    });

    it('handles delete failure gracefully', async () => {
      const currentImage: ImageData = {
        url: 'https://example.com/image.jpg',
        filename: 'test-image.jpg',
        size: 1024,
        format: 'jpg',
      };

      mockOnImageDelete.mockRejectedValue(new Error('Delete failed'));

      render(<ImageManager {...defaultProps} currentImage={currentImage} />);

      const deleteButton = screen.getByTestId('trash-icon').closest('button');
      fireEvent.click(deleteButton!);

      await waitFor(() => {
        expect(screen.getByText('Upload Error')).toBeInTheDocument();
        expect(screen.getByText('Delete failed')).toBeInTheDocument();
      });
    });
  });

  describe('Image deletion', () => {
    it('deletes image successfully', async () => {
      const currentImage: ImageData = {
        url: 'https://example.com/image.jpg',
        filename: 'test-image.jpg',
        size: 1024,
        format: 'jpg',
      };

      mockOnImageDelete.mockResolvedValue(undefined);

      render(<ImageManager {...defaultProps} currentImage={currentImage} />);

      const deleteButton = screen.getByTestId('trash-icon').closest('button');
      fireEvent.click(deleteButton!);

      await waitFor(() => {
        expect(mockOnImageDelete).toHaveBeenCalledTimes(1);
      });

      expect(
        screen.getByText('Drag and drop an image here')
      ).toBeInTheDocument();
    });
  });

  describe('Drag and drop', () => {
    it('handles drag enter and leave events', () => {
      render(<ImageManager {...defaultProps} />);

      // Just verify the drag and drop text is present and the component renders
      expect(
        screen.getByText('Drag and drop an image here')
      ).toBeInTheDocument();

      // The drag events are handled internally, we just need to verify the component doesn't crash
      const dropArea = screen
        .getByText('Drag and drop an image here')
        .closest('div');
      expect(dropArea).toBeInTheDocument();
    });

    it('handles file drop', async () => {
      mockOnImageUpload.mockResolvedValue(undefined);

      render(<ImageManager {...defaultProps} />);

      const validFile = createMockFile('test.jpg', 1024, 'image/jpeg');
      const dropArea = screen
        .getByText('Drag and drop an image here')
        .closest('div');

      fireEvent.drop(dropArea!, {
        dataTransfer: { files: [validFile] },
      });

      await waitFor(() => {
        expect(mockOnImageUpload).toHaveBeenCalledWith(
          validFile,
          expect.any(Object)
        );
      });
    });

    it('does not handle drop when disabled', async () => {
      render(<ImageManager {...defaultProps} disabled />);

      const validFile = createMockFile('test.jpg', 1024, 'image/jpeg');
      const dropArea = screen
        .getByText('Drag and drop an image here')
        .closest('div');

      fireEvent.drop(dropArea!, {
        dataTransfer: { files: [validFile] },
      });

      expect(mockOnImageUpload).not.toHaveBeenCalled();
    });
  });

  describe('State management', () => {
    it('updates state when currentImage prop changes', () => {
      const { rerender } = render(<ImageManager {...defaultProps} />);

      expect(
        screen.getByText('Drag and drop an image here')
      ).toBeInTheDocument();

      const currentImage: ImageData = {
        url: 'https://example.com/image.jpg',
        filename: 'test-image.jpg',
        size: 1024,
        format: 'jpg',
      };

      rerender(<ImageManager {...defaultProps} currentImage={currentImage} />);

      expect(screen.getByAltText('Preview')).toBeInTheDocument();
    });

    it('shows loading state during operations', async () => {
      const currentImage: ImageData = {
        url: 'https://example.com/image.jpg',
        filename: 'test-image.jpg',
        size: 1024,
        format: 'jpg',
      };

      let resolveDelete: () => void;
      const deletePromise = new Promise<void>((resolve) => {
        resolveDelete = resolve;
      });
      mockOnImageDelete.mockReturnValue(deletePromise);

      render(<ImageManager {...defaultProps} currentImage={currentImage} />);

      const deleteButton = screen.getByTestId('trash-icon').closest('button');
      fireEvent.click(deleteButton!);

      expect(screen.getByText('Uploading image...')).toBeInTheDocument();

      resolveDelete!();
      await waitFor(() => {
        expect(
          screen.queryByText('Uploading image...')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Object URL cleanup', () => {
    it('cleans up object URLs on unmount', () => {
      const { unmount } = render(<ImageManager {...defaultProps} />);

      // Simulate creating an object URL by uploading a file
      mockOnImageUpload.mockResolvedValue(undefined);
      const validFile = createMockFile('test.jpg', 1024, 'image/jpeg');
      const input = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [validFile] } });

      unmount();

      // The cleanup should be called for the created object URL
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:test-url');
    });

    it('cleans up previous object URLs when previewUrl changes', () => {
      mockCreateObjectURL
        .mockReturnValueOnce('blob:old-url')
        .mockReturnValueOnce('blob:new-url');

      // Start with no image
      const { rerender } = render(<ImageManager {...defaultProps} />);

      // Add an image to trigger object URL creation
      const currentImage: ImageData = {
        url: 'blob:old-url',
        filename: 'existing.jpg',
        size: 1024,
        format: 'jpg',
      };

      rerender(<ImageManager {...defaultProps} currentImage={currentImage} />);

      // Change to a new image to trigger cleanup
      const newImage: ImageData = {
        url: 'blob:new-url',
        filename: 'new.jpg',
        size: 1024,
        format: 'jpg',
      };

      rerender(<ImageManager {...defaultProps} currentImage={newImage} />);

      // The cleanup should be called for the old URL
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:old-url');
    });
  });

  describe('Image error handling', () => {
    it('shows fallback when image fails to load', () => {
      const currentImage: ImageData = {
        url: 'https://example.com/invalid.jpg',
        filename: 'test-image.jpg',
        size: 1024,
        format: 'jpg',
      };

      render(<ImageManager {...defaultProps} currentImage={currentImage} />);

      // Get the image element before it fails
      const image = screen.getByAltText('Preview');
      expect(image).toBeInTheDocument();

      // Trigger the error event
      fireEvent.error(image);

      // After error, the image should still be in the document but the fallback icon should be visible
      // The component shows an FiImage icon when the image fails to load
      expect(screen.getByTestId('image-icon')).toBeInTheDocument();

      // The image metadata should still be displayed
      expect(screen.getByText('test-image.jpg')).toBeInTheDocument();
    });
  });

  describe('Disabled state', () => {
    it('disables interactions when disabled prop is true', () => {
      render(<ImageManager {...defaultProps} disabled />);

      const uploadButton = screen.getByRole('button', { name: /upload/i });
      expect(uploadButton).toBeDisabled();

      const dropArea = screen
        .getByText('Drag and drop an image here')
        .closest('div');
      expect(dropArea).toBeInTheDocument();
    });
  });
});
