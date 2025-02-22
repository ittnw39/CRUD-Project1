package com.elice.boardproject.auth.oauth2;

import com.elice.boardproject.user.entity.ProviderType;
import com.elice.boardproject.user.entity.Role;
import com.elice.boardproject.user.entity.User;
import com.elice.boardproject.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createUser(email, name, picture));

        return new CustomOAuth2User(user, oauth2User.getAttributes());
    }

    private User createUser(String email, String name, String picture) {
        User user = User.builder()
                .email(email)
                .nickname(name)
                .profileImage(picture)
                .role(Role.USER)
                .providerType(ProviderType.GOOGLE)
                .build();

        return userRepository.save(user);
    }
} 