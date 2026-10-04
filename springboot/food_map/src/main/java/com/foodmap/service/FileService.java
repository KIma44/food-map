package com.foodmap.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileService {

    private final String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "reviews" + File.separator;

    public String saveFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs(); // uploads/reviews 디렉터리가 없으면 자동 생성
        }

        String originalFilename = file.getOriginalFilename();
        String storeFilename = UUID.randomUUID().toString() + "_" + originalFilename;

        File dest = new File(uploadDir + storeFilename);

        try {
            file.transferTo(dest);
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 중 오류가 발생했습니다.", e);
        }

        // DB 저장 및 React 프론트엔드 반환용 상대 URL 경로
        return "/uploads/reviews/" + storeFilename;
    }
}