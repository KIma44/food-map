package com.foodmap.controller;

import com.foodmap.dto.LoginDto;
import com.foodmap.dto.SignupDto;
import com.foodmap.dto.TokenDto;
import com.foodmap.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // MediaType 지정 및 required = false 확인 회워가입
    @PostMapping(value = "/join", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> signup(
            @RequestPart("signupDto") SignupDto signupDto,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {

        authService.signup(signupDto, profileImage);
        return ResponseEntity.ok("회원가입 성공");
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<TokenDto> login(@RequestBody LoginDto loginDto) {
        TokenDto tokenDto = authService.login(loginDto);
        return ResponseEntity.ok(tokenDto);
    }
}