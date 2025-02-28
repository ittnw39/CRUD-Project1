import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchDialogFooter from '../../../components/SearchDialog/SearchDialogFooter';

describe('SearchDialogFooter', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders cancel button', () => {
    render(<SearchDialogFooter onClose={mockOnClose} />);
    expect(screen.getByText('취소')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<SearchDialogFooter onClose={mockOnClose} />);
    
    const cancelButton = screen.getByText('취소');
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
}); 