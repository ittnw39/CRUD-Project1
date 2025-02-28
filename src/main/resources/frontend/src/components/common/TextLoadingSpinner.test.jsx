import React from 'react';
import { render } from '@testing-library/react';
import TextLoadingSpinner from './TextLoadingSpinner';

describe('TextLoadingSpinner', () => {
  it('should render loading text', () => {
    const { getByText } = render(<TextLoadingSpinner />);
    expect(getByText(/검색 중입니다\.*/)).toBeInTheDocument();
  });

  it('should have correct styles', () => {
    const { container } = render(<TextLoadingSpinner />);
    const box = container.firstChild;
    
    expect(box).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '40px'
    });
  });
}); 