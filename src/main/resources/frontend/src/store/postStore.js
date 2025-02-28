import { create } from 'zustand';
import axios from '../services/api/axios';

const usePostStore = create((set) => ({
  posts: [],
  currentPost: null,
  totalElements: 0,
  isLoading: false,
  error: null,

  fetchPosts: async (boardId, params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      
      // 페이지네이션 파라미터 (기본값 설정)
      const page = params.page !== undefined ? params.page - 1 : 0; // Spring Data JPA는 0-based pagination 사용
      const size = params.size || 10;
      queryParams.append('page', page);
      queryParams.append('size', size);
      
      // 정렬 파라미터
      if (params.sort) {
        queryParams.append('sort', params.sort);
      }
      
      // 필터 파라미터
      if (params.type && params.type !== 'all') {
        queryParams.append('type', params.type);
      }
      if (params.search && params.search.trim()) {
        queryParams.append('search', params.search.trim());
      }

      const response = await axios.get(`/api/boards/${boardId}/posts?${queryParams.toString()}`);
      set({ 
        posts: response.data.content || [],
        totalElements: response.data.totalElements || 0,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || '게시글 목록을 불러오는데 실패했습니다.',
        isLoading: false 
      });
    }
  },

  fetchPost: async (postId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/api/posts/${postId}`);
      set({ currentPost: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || '게시글을 불러오는데 실패했습니다.',
        isLoading: false 
      });
    }
  },

  createPost: async (postData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/api/posts', postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.error('게시글 작성 에러:', error);
      set({ 
        error: error.response?.data?.message || '게시글 작성에 실패했습니다.',
        isLoading: false 
      });
      throw error;
    }
  },

  updatePost: async (postId, postData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`/api/posts/${postId}`, postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      set(state => ({
        posts: state.posts.map(post => 
          post.id === postId ? response.data : post
        ),
        currentPost: response.data,
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || '게시글 수정에 실패했습니다.',
        isLoading: false 
      });
      throw error;
    }
  },

  deletePost: async (postId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/api/posts/${postId}`);
      set(state => ({
        posts: state.posts.filter(post => post.id !== postId),
        currentPost: null,
        totalElements: state.totalElements - 1,
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || '게시글 삭제에 실패했습니다.',
        isLoading: false 
      });
      return false;
    }
  },

  clearError: () => set({ error: null })
}));

export default usePostStore; 