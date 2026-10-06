package com.foodmap.controller;

import com.foodmap.dto.UserResponseDto;
import com.foodmap.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
}