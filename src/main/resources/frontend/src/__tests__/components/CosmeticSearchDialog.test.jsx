import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import CosmeticSearchDialog from '../../components/CosmeticSearchDialog';
import useCosmeticStore from '../../store/cosmeticStore';

// Mock the store
jest.mock('../../store/cosmeticStore', () => ({
  __esModule: true,
  default: jest.fn()
}));

const mockCosmetics = [
  {
    cosmeticReportSeq: 1,
    itemName: '수분 크림',
    entpName: '샘플 브랜드',
    spf: '50+',
    pa: '+++',
    waterProofingName: '워터프루프',
    averageRating: 4.5
  },
  {
    cosmeticReportSeq: 2,
    itemName: '선크림',
    entpName: '테스트 브랜드',
    spf: '30',
    pa: '++',
    averageRating: 4.0
  }
];

describe('CosmeticSearchDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    useCosmeticStore.mockImplementation(() => ({
      cosmetics: mockCosmetics
    }));
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders dialog with search input', () => {
    render(
      <CosmeticSearchDialog
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('화장품 검색')).toBeInTheDocument();
    expect(screen.getByLabelText('화장품 이름 또는 브랜드 검색')).toBeInTheDocument();
  });

  it('shows loading state while searching', async () => {
    render(
      <CosmeticSearchDialog
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    const searchInput = screen.getByLabelText('화장품 이름 또는 브랜드 검색');
    fireEvent.change(searchInput, { target: { value: '수분' } });

    // 로딩 상태 확인
    expect(screen.getByText(/검색 중입니다/)).toBeInTheDocument();

    // 디바운스 타이머와 API 딜레이 진행
    await act(async () => {
      jest.advanceTimersByTime(600); // 디바운스(300ms) + API 딜레이(300ms)
    });

    // 검색 결과 표시 확인
    await waitFor(() => {
      expect(screen.getByText(/수분 크림/)).toBeInTheDocument();
    });
  });

  it('filters cosmetics based on search term', async () => {
    render(
      <CosmeticSearchDialog
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    const searchInput = screen.getByLabelText('화장품 이름 또는 브랜드 검색');
    fireEvent.change(searchInput, { target: { value: '선크림' } });

    // 디바운스 타이머와 API 딜레이 진행
    await act(async () => {
      jest.advanceTimersByTime(600); // 디바운스(300ms) + API 딜레이(300ms)
    });

    await waitFor(() => {
      expect(screen.getByText(/선크림/)).toBeInTheDocument();
      expect(screen.queryByText(/수분 크림/)).not.toBeInTheDocument();
    });
  });

  it('calls onSelect when a cosmetic is clicked', async () => {
    render(
      <CosmeticSearchDialog
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    // 초기 렌더링 대기
    await act(async () => {
      jest.advanceTimersByTime(600);
    });

    await waitFor(() => {
      const cosmeticItem = screen.getByText(/수분 크림/);
      fireEvent.click(cosmeticItem);
    });

    expect(mockOnSelect).toHaveBeenCalledWith(mockCosmetics[0]);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <CosmeticSearchDialog
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    fireEvent.click(screen.getByText('취소'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays cosmetic details correctly', async () => {
    render(
      <CosmeticSearchDialog
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    // 초기 렌더링 대기
    await act(async () => {
      jest.advanceTimersByTime(600);
    });

    await waitFor(() => {
      // 첫 번째 화장품의 상세 정보 확인
      expect(screen.getByText(/수분 크림/)).toBeInTheDocument();
      expect(screen.getByText(/브랜드: 샘플 브랜드/)).toBeInTheDocument();
      expect(screen.getByText(/SPF 50\+/)).toBeInTheDocument();
      expect(screen.getByText(/PA \+\+\+/)).toBeInTheDocument();
      expect(screen.getByText(/워터프루프/)).toBeInTheDocument();
      expect(screen.getByText(/4.5/)).toBeInTheDocument();
    });
  });
}); 