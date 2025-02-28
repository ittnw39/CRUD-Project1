import '@testing-library/jest-dom';

// Mock timer functions
const mockSetInterval = jest.fn((cb) => {
  cb();
  return 123;
});

const mockClearInterval = jest.fn();

global.setInterval = mockSetInterval;
global.clearInterval = mockClearInterval; 