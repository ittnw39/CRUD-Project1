import create from 'zustand';
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
      
      // 페이지네이션 파라미터
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);
      
      // 정렬 파라미터
      if (params.sort && params.direction) {
        queryParams.append('sort', `${params.sort},${params.direction}`);
      }
      
      // 필터 파라미터
      if (params.type) queryParams.append('type', params.type);
      if (params.search) queryParams.append('search', params.search);

      const response = await axios.get(`/api/boards/${boardId}/posts?${queryParams.toString()}`);
      set({ 
        posts: response.data.content,
        totalElements: response.data.totalElements,
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

  createPost: async (postData, images) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      
      if (images && images.length > 0) {
        images.forEach(image => {
          formData.append('images', image);
        });
      }

      const response = await axios.post('/api/posts', postData, {
        headers: {
          'Content-Type': 'application/json'
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
      return null;
    }
  },

  updatePost: async (postId, postData, images) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      
      if (images && images.length > 0) {
        images.forEach(image => {
          formData.append('images', image);
        });
      }

      const response = await axios.put(`/api/posts/${postId}`, postData, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      set(state => ({
        posts: state.posts.map(post => 
          post.id === postId ? response.data : post
        ),
        currentPost: response.data,
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || '게시글 수정에 실패했습니다.',
        isLoading: false 
      });
      return false;
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