import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Link as MuiLink,
  Alert
} from '@mui/material';
import useAuthStore from '../../store/authStore';
import ErrorAlert from '../../components/common/ErrorAlert';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: ''
  });
  const [validationError, setValidationError] = useState('');
  const { register, error, clearError } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setValidationError('');
  };

  const validateForm = () => {
    if (!formData.email.includes('@')) {
      setValidationError('올바른 이메일 형식이 아닙니다.');
      return false;
    }
    if (formData.password.length < 6) {
      setValidationError('비밀번호는 6자 이상이어야 합니다.');
      return false;
    }
    if (formData.password !== formData.passwordConfirm) {
      setValidationError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    if (formData.nickname.length < 2 || formData.nickname.length > 10) {
      setValidationError('닉네임은 2자 이상 10자 이하여야 합니다.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await register({
      email: formData.email,
      password: formData.password,
      nickname: formData.nickname
    });
    
    if (success) {
      navigate('/login');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          회원가입
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {validationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {validationError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="이메일"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="비밀번호"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            helperText="6자 이상 입력해주세요"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="비밀번호 확인"
            name="passwordConfirm"
            type="password"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="닉네임"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            required
            helperText="2자 이상 10자 이하로 입력해주세요"
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mb: 2 }}
          >
            회원가입
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              이미 계정이 있으신가요?{' '}
              <MuiLink component={Link} to="/login">
                로그인
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>

      <ErrorAlert
        open={!!error}
        message={error || ''}
        onClose={clearError}
      />
    </Container>
  );
};

export default RegisterPage; 