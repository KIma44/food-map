package com.foodmap.dto;

import com.foodmap.entity.Role;
import com.foodmap.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private Long userId;
    private String email;
    private String name;
    private String profile;
    private Role role;
    private List<AllergyDto> allergies;

    public static UserResponseDto from(User user) {
        List<AllergyDto> allergyDtos = user.getAllergies().stream()
                .map(a -> AllergyDto.builder()
                        .allergyName(a.getAllergyName())
                        .isCustom(a.getIsCustom())
                        .build())
                .collect(Collectors.toList());

        return UserResponseDto.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .name(user.getName())
                .profile(user.getProfile())
                .role(user.getRole())
                .allergies(allergyDtos)
                .build();
    }
}