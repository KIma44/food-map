package com.foodmap.repository;

import com.foodmap.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    // JpaRepository 기본 제공 메서드로 findById(Long restaurantId) 사용 가능
}