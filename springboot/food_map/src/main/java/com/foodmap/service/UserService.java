package com.foodmap.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodmap.dto.AllergyDto;
import com.foodmap.dto.UserResponseDto;
import com.foodmap.entity.User;
import com.foodmap.entity.UserAllergy;
import com.foodmap.repository.MyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final MyRepository myRepository;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public UserResponseDto getMyInfo(String email) {
        User user = myRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다. email: " + email));

        return UserResponseDto.from(user);
    }

    @Transactional
    public UserResponseDto updateMyInfo(String email, String name, MultipartFile profileImage, String allergiesJson) {
        User user = myRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다. email: " + email));

        if (name != null && !name.trim().isEmpty()) {
            user.setName(name);
        }

        if (profileImage != null && !profileImage.isEmpty()) {
            String savedPath = saveProfileImage(profileImage);
            user.setProfile(savedPath);
        }

        // 알레르기 업데이트 처리
        if (allergiesJson != null) {
            try {
                List<AllergyDto> newAllergyList = objectMapper.readValue(allergiesJson, new TypeReference<List<AllergyDto>>() {});

                // 1. 요청으로 들어온 유효한 알레르기 이름 목록 추출
                Set<String> requestNames = newAllergyList.stream()
                        .map(AllergyDto::getAllergyName)
                        .filter(n -> n != null && !n.trim().isEmpty())
                        .map(String::trim)
                        .collect(Collectors.toSet());

                // 2. 요청에 없는 기존 알레르기 항목 삭제 (이름 기준 차집합)
                user.getAllergies().removeIf(existing -> !requestNames.contains(existing.getAllergyName()));

                // 3. 삭제 후 남은 기존 알레르기 이름 목록 수집
                Set<String> existingNames = user.getAllergies().stream()
                        .map(UserAllergy::getAllergyName)
                        .collect(Collectors.toSet());

                // 4. 요청 중 기존에 없던 "신규" 알레르기만 생성하여 추가
                for (AllergyDto dto : newAllergyList) {
                    String allergyName = dto.getAllergyName() != null ? dto.getAllergyName().trim() : "";
                    if (allergyName.isEmpty()) continue;

                    // 이미 존재하는 항목이면 추가하지 않고 통과 (기존 PK 영속성 유지)
                    if (!existingNames.contains(allergyName)) {
                        UserAllergy userAllergy = UserAllergy.builder()
                                .user(user)
                                .allergyName(allergyName)
                                .isCustom(dto.getIsCustom() != null ? dto.getIsCustom() : false)
                                .build();

                        user.getAllergies().add(userAllergy);
                        existingNames.add(allergyName); // 루프 내 중복 방지
                    }
                }
            } catch (Exception e) {
                throw new RuntimeException("알레르기 데이터 파싱 중 오류 발생", e);
            }
        }

        return UserResponseDto.from(user);
    }

    private String saveProfileImage(MultipartFile file) {
        try {
            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "profile" + File.separator;
            File folder = new File(uploadDir);
            if (!folder.exists()) {
                folder.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            String storeFileName = UUID.randomUUID().toString() + "_" + originalFilename;
            String fullPath = uploadDir + storeFileName;

            file.transferTo(new File(fullPath));

            return "/uploads/profile/" + storeFileName;
        } catch (IOException e) {
            throw new RuntimeException("프로필 이미지 저장 실패", e);
        }
    }
}