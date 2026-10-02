package com.foodmap.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileService {

    // 로컬 저장 경로 (프로젝트루트/uploads/reviews/)
    private final String uploadDir = System.getProperty("user.dir") + "/uploads/reviews/";

    public String saveFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // 폴더가 없으면 생성
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // 파일명 중복 방지를 위한 UUID 생성
        String originalFilename = file.getOriginalFilename();
        String storeFilename = UUID.randomUUID().toString() + "_" + originalFilename;

        File dest = new File(uploadDir + storeFilename);

        try {
            file.transferTo(dest); // 파일 저장
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 중 오류가 발생했습니다.", e);
        }

        // DB에 저장할 상대 경로 또는 파일명 반환
        return "/uploads/reviews/" + storeFilename;
    }
}