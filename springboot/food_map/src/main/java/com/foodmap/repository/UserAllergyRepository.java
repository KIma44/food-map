package com.foodmap.repository;

import com.foodmap.entity.UserAllergy;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserAllergyRepository extends JpaRepository<UserAllergy, Long> {

    List<UserAllergy> findByUser_UserId(Long userId);
}