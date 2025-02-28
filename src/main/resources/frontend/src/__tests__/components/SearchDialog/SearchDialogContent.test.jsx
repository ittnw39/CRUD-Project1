import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchDialogContent from '../../../components/SearchDialog/SearchDialogContent';

describe('SearchDialogContent', () => {
  const mockCosmetics = [
    {
      cosmeticReportSeq: 1,
      itemName: '수분 크림',
      entpName: '샘플 브랜드',
      spf: '50+',
      pa: '+++',
      waterProofingName: '워터프루프',
      averageRating: 4.5
    }
  ];

  const mockOnSelect = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading spinner when isLoading is true', () => {
    render(
      <SearchDialogContent
        isLoading={true}
        cosmetics={[]}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText(/검색 중입니다/)).toBeInTheDocument();
  });

  it('renders cosmetic list when not loading', () => {
    render(
      <SearchDialogContent
        isLoading={false}
        cosmetics={mockCosmetics}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText('수분 크림')).toBeInTheDocument();
    expect(screen.getByText('브랜드: 샘플 브랜드')).toBeInTheDocument();
  });

  it('calls onSelect and onClose when cosmetic item is clicked', () => {
    render(
      <SearchDialogContent
        isLoading={false}
        cosmetics={mockCosmetics}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    const cosmeticItem = screen.getByText('수분 크림').closest('div[role="button"]');
    fireEvent.click(cosmeticItem);

    expect(mockOnSelect).toHaveBeenCalledWith(mockCosmetics[0]);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders empty list when no cosmetics provided', () => {
    render(
      <SearchDialogContent
        isLoading={false}
        cosmetics={[]}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );
    
    const list = screen.getByRole('list');
    expect(list).toBeEmptyDOMElement();
  });
}); 