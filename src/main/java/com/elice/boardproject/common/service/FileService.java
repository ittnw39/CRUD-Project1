package com.elice.boardproject.common.service;

import com.elice.boardproject.common.exception.CustomException;
import com.elice.boardproject.common.exception.ErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
public class FileService {
    private final String uploadDir = "uploads";
    private final Path uploadPath;
    
    // 허용할 파일 확장자 목록
    private static final Set<String> ALLOWED_EXTENSIONS = new HashSet<>(
        Arrays.asList(".jpg", ".jpeg", ".png", ".gif")
    );

    public FileService() {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        createUploadDirectory();
    }

    private void createUploadDirectory() {
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "업로드 디렉토리 생성에 실패했습니다.");
        }
    }

    public String uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "파일이 비어있습니다.");
        }

        String originalFilename = StringUtils.cleanPath(
            file.getOriginalFilename() != null ? file.getOriginalFilename() : "unknown"
        );
        
        // 파일명에서 확장자 추출
        String extension = originalFilename.substring(
            originalFilename.lastIndexOf(".")).toLowerCase();

        // 확장자 검증
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new CustomException(
                ErrorCode.INVALID_INPUT_VALUE, 
                "허용되지 않는 파일 형식입니다. 허용된 확장자: " + ALLOWED_EXTENSIONS
            );
        }

        try {
            // UUID로 고유한 파일명 생성
            String filename = UUID.randomUUID().toString() + extension;
            
            // 저장할 파일의 전체 경로
            Path targetPath = uploadPath.resolve(filename).normalize();
            
            // 디렉토리 트래버설 공격 방지
            if (!targetPath.getParent().equals(uploadPath)) {
                throw new CustomException(
                    ErrorCode.INVALID_INPUT_VALUE, 
                    "잘못된 파일 경로입니다."
                );
            }
            
            // 파일 저장
            Files.copy(file.getInputStream(), targetPath);
            
            // 프론트엔드에서 접근 가능한 URL 경로 반환
            return "/uploads/" + filename;
            
        } catch (IOException e) {
            throw new CustomException(
                ErrorCode.INTERNAL_SERVER_ERROR, 
                "파일 업로드에 실패했습니다: " + e.getMessage()
            );
        }
    }

    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }

        try {
            // URL에서 파일명만 추출
            String filename = StringUtils.cleanPath(
                fileUrl.substring(fileUrl.lastIndexOf("/") + 1)
            );
            
            // 삭제할 파일의 전체 경로
            Path filePath = uploadPath.resolve(filename).normalize();
            
            // 디렉토리 트래버설 공격 방지
            if (!filePath.getParent().equals(uploadPath)) {
                throw new CustomException(
                    ErrorCode.INVALID_INPUT_VALUE, 
                    "잘못된 파일 경로입니다."
                );
            }
            
            // 파일이 존재하면 삭제
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
            
        } catch (IOException e) {
            throw new CustomException(
                ErrorCode.INTERNAL_SERVER_ERROR, 
                "파일 삭제에 실패했습니다: " + e.getMessage()
            );
        }
    }
} 