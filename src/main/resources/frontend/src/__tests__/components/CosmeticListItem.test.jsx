import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CosmeticListItem from '../../components/CosmeticListItem';

describe('CosmeticListItem', () => {
  const mockCosmetic = {
    itemName: '수분 크림',
    entpName: '샘플 브랜드',
    spf: '50+',
    pa: '+++',
    waterProofingName: '워터프루프',
    averageRating: 4.5
  };

  const mockOnClick = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders basic cosmetic information', () => {
    render(<CosmeticListItem cosmetic={mockCosmetic} onClick={mockOnClick} />);

    expect(screen.getByText('수분 크림')).toBeInTheDocument();
    expect(screen.getByText('브랜드: 샘플 브랜드')).toBeInTheDocument();
  });

  it('renders rating when averageRating is provided', () => {
    render(<CosmeticListItem cosmetic={mockCosmetic} onClick={mockOnClick} />);

    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('does not render rating when averageRating is 0', () => {
    const cosmeticWithoutRating = {
      ...mockCosmetic,
      averageRating: 0
    };

    render(<CosmeticListItem cosmetic={cosmeticWithoutRating} onClick={mockOnClick} />);

    expect(screen.queryByText('0.0')).not.toBeInTheDocument();
  });

  it('renders all provided protection information', () => {
    render(<CosmeticListItem cosmetic={mockCosmetic} onClick={mockOnClick} />);

    expect(screen.getByText('SPF 50+')).toBeInTheDocument();
    expect(screen.getByText('PA +++')).toBeInTheDocument();
    expect(screen.getByText('워터프루프')).toBeInTheDocument();
  });

  it('does not render protection information when not provided', () => {
    const cosmeticWithoutProtection = {
      itemName: '수분 크림',
      entpName: '샘플 브랜드',
      averageRating: 4.5
    };

    render(<CosmeticListItem cosmetic={cosmeticWithoutProtection} onClick={mockOnClick} />);

    expect(screen.queryByText(/SPF/)).not.toBeInTheDocument();
    expect(screen.queryByText(/PA/)).not.toBeInTheDocument();
    expect(screen.queryByText('워터프루프')).not.toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    render(<CosmeticListItem cosmetic={mockCosmetic} onClick={mockOnClick} />);

    const listItem = screen.getByText('수분 크림').closest('div[role="button"]');
    fireEvent.click(listItem);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies hover styles correctly', () => {
    render(<CosmeticListItem cosmetic={mockCosmetic} onClick={mockOnClick} />);

    const listItem = screen.getByText('수분 크림').closest('div[role="button"]');
    
    expect(listItem).toHaveStyle({
      border: '1px solid #eee',
      marginBottom: '8px'
    });
  });
}); 