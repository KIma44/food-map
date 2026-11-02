package com.foodmap.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_allergy")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAllergy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_allergy_id")
    private Long userAllergyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "allergy_name", nullable = false, length = 50)
    private String allergyName;

    @Column(name = "is_custom")
    @Builder.Default
    private Boolean isCustom = false;
}