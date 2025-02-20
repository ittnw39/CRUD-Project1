package com.elice.boardproject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String defaultHome() {
        return "redirect:/boards";
    }
}
