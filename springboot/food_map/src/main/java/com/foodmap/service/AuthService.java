package com.foodmap.service;

import com.foodmap.dto.LoginDto;
import com.foodmap.dto.SignupDto;
import com.foodmap.dto.TokenDto;
import com.foodmap.entity.Role;
import com.foodmap.entity.User;
import com.foodmap.repository.UserRepository;
import com.foodmap.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public void signup(SignupDto signupDto, MultipartFile profileImage) {
        if (userRepository.existsByEmail(signupDto.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }

        String profilePath = null;

        // 프로필 파일 저장 로직
        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                // 저장 경로를 uploads/profile/ 로 변경
                String uploadDir = System.getProperty("user.dir") + "/uploads/profile/";
                File folder = new File(uploadDir);
                if (!folder.exists()) folder.mkdirs();

                String fileName = UUID.randomUUID() + "_" + profileImage.getOriginalFilename();
                profileImage.transferTo(new File(uploadDir + fileName));

                // DB에 저장될 웹 접근 상대 경로
                profilePath = "/uploads/profile/" + fileName;
            } catch (IOException e) {
                throw new RuntimeException("파일 업로드 실패", e);
            }
        }

        User user = User.builder()
                .email(signupDto.getEmail())
                .password(passwordEncoder.encode(signupDto.getPassword()))
                .name(signupDto.getName())
                .profile(profilePath)
                .role(Role.User)
                .build();

        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public TokenDto login(LoginDto loginDto) {
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new RuntimeException("가입되지 않은 이메일입니다."));

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        String accessToken = jwtTokenProvider.createAccessToken(user.getUserId(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getEmail());

        return TokenDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .name(user.getName())
                .profile(user.getProfile()) // /uploads/profile/xxx.jpg 형태로 반환
                .role(user.getRole().name())
                .build();
    }
}