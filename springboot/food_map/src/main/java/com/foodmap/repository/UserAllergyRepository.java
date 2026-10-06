package com.foodmap.repository;

import com.foodmap.entity.User;
import com.foodmap.entity.UserAllergy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAllergyRepository extends JpaRepository<UserAllergy, Long> {
    List<UserAllergy> findByUser(User user);
    void deleteByUser(User user);
}