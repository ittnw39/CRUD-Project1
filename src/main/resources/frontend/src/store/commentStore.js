import { create } from 'zustand';
import axios from '../services/api/axios';

const useCommentStore = create((set) => ({
  comments: [],
  isLoading: false,
  error: null,

  fetchComments: async (postId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/api/comments/post/${postId}`);
      set({ comments: response.data || [], isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || '댓글을 불러오는데 실패했습니다.',
        isLoading: false 
      });
    }
  },

  createComment: async (postId, content) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`/api/comments`, { 
        postId,
        content 
      });
      set(state => ({
        comments: [...state.comments, response.data],
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || '댓글 작성에 실패했습니다.',
        isLoading: false 
      });
      return false;
    }
  },

  updateComment: async (postId, commentId, content) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`/api/posts/${postId}/comments/${commentId}`, { content });
      set(state => ({
        comments: state.comments.map(comment => 
          comment.id === commentId ? response.data : comment
        ),
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || '댓글 수정에 실패했습니다.',
        isLoading: false 
      });
      return false;
    }
  },

  deleteComment: async (postId, commentId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/api/posts/${postId}/comments/${commentId}`);
      set(state => ({
        comments: state.comments.filter(comment => comment.id !== commentId),
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || '댓글 삭제에 실패했습니다.',
        isLoading: false 
      });
      return false;
    }
  },

  clearError: () => set({ error: null })
}));

export default useCommentStore; 