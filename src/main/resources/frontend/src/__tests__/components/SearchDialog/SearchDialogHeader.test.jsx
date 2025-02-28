import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchDialogHeader from '../../../components/SearchDialog/SearchDialogHeader';

describe('SearchDialogHeader', () => {
  const mockSearchTerm = '';
  const mockOnSearchChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dialog title', () => {
    render(
      <SearchDialogHeader
        searchTerm={mockSearchTerm}
        onSearchChange={mockOnSearchChange}
      />
    );
    expect(screen.getByText('화장품 검색')).toBeInTheDocument();
  });

  it('renders search input field', () => {
    render(
      <SearchDialogHeader
        searchTerm={mockSearchTerm}
        onSearchChange={mockOnSearchChange}
      />
    );
    expect(screen.getByLabelText('화장품 이름 또는 브랜드 검색')).toBeInTheDocument();
  });

  it('calls onSearchChange when input value changes', () => {
    render(
      <SearchDialogHeader
        searchTerm={mockSearchTerm}
        onSearchChange={mockOnSearchChange}
      />
    );
    
    const input = screen.getByLabelText('화장품 이름 또는 브랜드 검색');
    fireEvent.change(input, { target: { value: '테스트' } });
    
    expect(mockOnSearchChange).toHaveBeenCalledWith('테스트');
  });

  it('displays current search term value', () => {
    const currentSearchTerm = '테스트 검색어';
    render(
      <SearchDialogHeader
        searchTerm={currentSearchTerm}
        onSearchChange={mockOnSearchChange}
      />
    );
    
    const input = screen.getByLabelText('화장품 이름 또는 브랜드 검색');
    expect(input).toHaveValue(currentSearchTerm);
  });
}); 