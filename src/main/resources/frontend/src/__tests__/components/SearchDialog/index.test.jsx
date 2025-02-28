import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import SearchDialog from '../../../components/SearchDialog';
import useSearchDialog from '../../../hooks/useSearchDialog';

// Mock the custom hook
jest.mock('../../../hooks/useSearchDialog');

describe('SearchDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnSelect = jest.fn();
  const mockHandleSearchChange = jest.fn();

  const mockHookReturn = {
    searchTerm: '',
    isLoading: false,
    filteredCosmetics: [
      {
        cosmeticReportSeq: 1,
        itemName: '수분 크림',
        entpName: '샘플 브랜드',
        spf: '50+',
        pa: '+++',
        waterProofingName: '워터프루프',
        averageRating: 4.5
      }
    ],
    handleSearchChange: mockHandleSearchChange
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useSearchDialog.mockImplementation(() => mockHookReturn);
  });

  it('renders all dialog components', () => {
    render(
      <SearchDialog
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('화장품 검색')).toBeInTheDocument();
    expect(screen.getByLabelText('화장품 이름 또는 브랜드 검색')).toBeInTheDocument();
    expect(screen.getByText('취소')).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    useSearchDialog.mockImplementation(() => ({
      ...mockHookReturn,
      isLoading: true
    }));

    render(
      <SearchDialog
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText(/검색 중입니다/)).toBeInTheDocument();
  });

  it('handles search input change', () => {
    render(
      <SearchDialog
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    const input = screen.getByLabelText('화장품 이름 또는 브랜드 검색');
    fireEvent.change(input, { target: { value: '테스트' } });

    expect(mockHandleSearchChange).toHaveBeenCalledWith('테스트');
  });

  it('handles cosmetic selection', () => {
    render(
      <SearchDialog
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    const cosmeticItem = screen.getByText('수분 크림').closest('div[role="button"]');
    fireEvent.click(cosmeticItem);

    expect(mockOnSelect).toHaveBeenCalledWith(mockHookReturn.filteredCosmetics[0]);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles dialog close', () => {
    render(
      <SearchDialog
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    const cancelButton = screen.getByText('취소');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
}); 