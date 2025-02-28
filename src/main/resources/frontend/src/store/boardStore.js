import { create } from 'zustand';
import axios from '../services/api/axios';

const useBoardStore = create((set) => ({
  boards: [],
  currentBoard: null,
  isLoading: false,
  error: null,

  fetchBoards: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/boards');
      set({ boards: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || '게시판 목록을 불러오는데 실패했습니다.',
        isLoading: false 
      });
    }
  },

  fetchBoard: async (boardId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/api/boards/${boardId}`);
      set({ currentBoard: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || '게시판 정보를 불러오는데 실패했습니다.',
        isLoading: false 
      });
    }
  },

  createBoard: async (boardData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/api/boards', boardData);
      set(state => ({
        boards: [...state.boards, response.data],
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || '게시판 생성에 실패했습니다.',
        isLoading: false 
      });
      return false;
    }
  },

  updateBoard: async (boardId, boardData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`/api/boards/${boardId}`, boardData);
      set(state => ({
        boards: state.boards.map(board => 
          board.id === boardId ? response.data : board
        ),
        currentBoard: response.data,
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || '게시판 수정에 실패했습니다.',
        isLoading: false 
      });
      return false;
    }
  },

  deleteBoard: async (boardId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/api/boards/${boardId}`);
      set(state => ({
        boards: state.boards.filter(board => board.id !== boardId),
        currentBoard: null,
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || '게시판 삭제에 실패했습니다.',
        isLoading: false 
      });
      return false;
    }
  },

  clearError: () => set({ error: null })
}));

export default useBoardStore; 