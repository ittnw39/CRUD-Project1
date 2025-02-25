ALTER TABLE cosmetics
ADD COLUMN categories VARCHAR(50);

COMMENT ON COLUMN cosmetics.categories IS '화장품 카테고리 (스킨케어, 메이크업, 바디케어, 선케어)'; 