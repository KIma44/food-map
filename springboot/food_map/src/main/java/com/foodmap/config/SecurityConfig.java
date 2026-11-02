package com.foodmap.config;

import com.foodmap.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
<<<<<<< HEAD
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer; // 👉 임포트 확인
=======
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
>>>>>>> e023bf613bd1b9fc0746e53dfc7b540188e23dc6
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

<<<<<<< HEAD
    // 💡 핵심: /uploads/** 경로를 시큐리티 필터 적용 대상에서 완전히 제외 (403 방지)
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
                .requestMatchers("/uploads/**", "/favicon.ico", "/error");
    }

=======
>>>>>>> e023bf613bd1b9fc0746e53dfc7b540188e23dc6
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
<<<<<<< HEAD
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/join", "/api/login", "/api/auth/**", "/api/reviews/*/ai-result").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/reviews", "/api/reviews/**").permitAll()
                        .requestMatchers("/api/mypage/**", "/api/users/me").permitAll()
=======
                        // 1. CORS Preflight 요청(OPTIONS)은 무조건 전면 허용
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2. 인증 없이 접근 가능한 Public 엔드포인트 및 static 이미지 경로 + FastAPI AI 콜백 허용 🚀
                        .requestMatchers("/api/join", "/api/login", "/api/auth/**", "/uploads/**", "/api/reviews/*/ai-result").permitAll()

                        // 3. 리뷰 목록 및 상세 조회(GET) 허용
                        .requestMatchers(HttpMethod.GET, "/api/reviews", "/api/reviews/**").permitAll()

                        // 4. 나머지 요청(POST, PUT, DELETE 등)은 JWT 인증 필요
>>>>>>> e023bf613bd1b9fc0746e53dfc7b540188e23dc6
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
<<<<<<< HEAD
        config.setExposedHeaders(List.of("Authorization"));
=======
        config.setExposedHeaders(List.of("Authorization")); // 필요한 경우 클라이언트에서 읽을 수 있게 헤더 노출
>>>>>>> e023bf613bd1b9fc0746e53dfc7b540188e23dc6
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}