package com.foodmap.controller;

import com.foodmap.dto.UserResponseDto;
import com.foodmap.security.CustomUserDetails;
import com.foodmap.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 내 정보 조회
    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getMyInfo(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        UserResponseDto myInfo = userService.getMyInfo(userDetails.getUsername());
        return ResponseEntity.ok(myInfo);
    }

    // 내 정보 및 프로필 이미지/알레르기 수정
    @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponseDto> updateMyInfo(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestPart(value = "name", required = false) String name,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestPart(value = "allergies", required = false) String allergies) { // 1. RequestPart 추가

        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        // 2. 4번째 인자로 allergies 전달
        UserResponseDto updatedUser = userService.updateMyInfo(
                userDetails.getUsername(),
                name,
                profileImage,
                allergies
        );

        return ResponseEntity.ok(updatedUser);
    }

    // 내 알레르기 목록 조회  로그인한 사용자의 알레르기 이름 리스트 반환
    @GetMapping("/allergies")
    public ResponseEntity<?> getMyAllergies(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        // userService에서 해당 유저의 알레르기 목록을 List<String> 또는 DTO 형태로 가져오는 메서드 호출
        List<String> allergies = userService.getUserAllergies(userDetails.getUserId());
        return ResponseEntity.ok(allergies);
    }
}