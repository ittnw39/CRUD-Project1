package com.elice.boardproject;

import com.elice.boardproject.board.controller.BoardController;
import com.elice.boardproject.board.entity.Board;
import com.elice.boardproject.board.service.BoardService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.hamcrest.Matchers.is;


import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(BoardController.class)
public class BoardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BoardService boardService;

    @Test
    public void whenGetAllBoards_thenReturnBoardsTemplate() throws Exception {
        List<Board> allBoards = Arrays.asList(
                Board.builder().id(1L).name("Board 1").build(),
                Board.builder().id(2L).name("Board 2").build()
        );

        when(boardService.findAll()).thenReturn(allBoards);

        mockMvc.perform(get("/boards"))
                .andExpect(status().isOk())
                .andExpect(view().name("board/boards"))
                .andExpect(model().attributeExists("boards"))
                .andExpect(model().attribute("boards", hasSize(2)))
                .andExpect(model().attribute("boards", hasItem(
                        hasProperty("id", is(1L))
                )))
                .andExpect(model().attribute("boards", hasItem(
                        hasProperty("name", is("Board 1"))
                )))
                .andExpect(model().attribute("boards", hasItem(
                        hasProperty("id", is(2L))
                )))
                .andExpect(model().attribute("boards", hasItem(
                        hasProperty("name", is("Board 2"))
                )));
    }
}
