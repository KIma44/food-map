package com.foodmap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllergyDto {
    private Long userAllergyId;
    private String allergyName;
    private Boolean isCustom;
}