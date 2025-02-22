import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Typography,
  styled
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Forum as ForumIcon,
  Category as CategoryIcon,
  Star as StarIcon,
  QuestionAnswer as QuestionAnswerIcon,
  RateReview as RateReviewIcon,
  Announcement as AnnouncementIcon
} from '@mui/icons-material';
import useBoardStore from '../../store/boardStore';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 280,
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  overflowY: 'auto'
}));

const getIconByCategory = (category) => {
  switch (category) {
    case 'GENERAL':
      return <ForumIcon />;
    case 'REVIEW':
      return <RateReviewIcon />;
    case 'NOTICE':
      return <AnnouncementIcon />;
    case 'QNA':
      return <QuestionAnswerIcon />;
    default:
      return <ForumIcon />;
  }
};

const Sidebar = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});
  const { boards, fetchBoards } = useBoardStore();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  useEffect(() => {
    const boardCategory = {
      id: 'boards',
      name: '게시판',
      icon: <ForumIcon />,
      items: boards.map(board => ({
        id: board.id.toString(),
        name: board.name,
        icon: getIconByCategory(board.category),
        path: `/boards/${board.id}`
      }))
    };

    const cosmeticCategory = {
      id: 'cosmetics',
      name: '화장품 카테고리',
      icon: <CategoryIcon />,
      items: [
        { id: 'skincare', name: '스킨케어', icon: <StarIcon />, path: '/cosmetics?category=SKINCARE' },
        { id: 'makeup', name: '메이크업', icon: <StarIcon />, path: '/cosmetics?category=MAKEUP' },
        { id: 'bodycare', name: '바디케어', icon: <StarIcon />, path: '/cosmetics?category=BODYCARE' },
        { id: 'suncare', name: '선케어', icon: <StarIcon />, path: '/cosmetics?category=SUNCARE' }
      ]
    };

    setCategories([boardCategory, cosmeticCategory]);
  }, [boards]);

  const handleToggle = (categoryId) => {
    setExpanded(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <SidebarContainer>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="h2">
          메뉴
        </Typography>
      </Box>
      <List component="nav">
        {categories.map((category) => (
          <React.Fragment key={category.id}>
            <ListItemButton onClick={() => handleToggle(category.id)}>
              <ListItemIcon>{category.icon}</ListItemIcon>
              <ListItemText primary={category.name} />
              {expanded[category.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
            <Collapse in={expanded[category.id]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {category.items.map((item) => (
                  <ListItemButton
                    key={item.id}
                    sx={{ pl: 4 }}
                    onClick={() => handleItemClick(item.path)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </SidebarContainer>
  );
};

export default Sidebar; 