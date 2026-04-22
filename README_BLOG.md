# Ứng dụng Blog Cá nhân

Ứng dụng Blog cá nhân được xây dựng bằng React, Ant Design và UmiJS.

## Tính năng

### Trang chủ
- Hiển thị danh sách bài viết dưới dạng thẻ (Card)
- Mỗi thẻ gồm: ảnh đại diện, tiêu đề, tóm tắt, ngày đăng, tác giả và thẻ tag
- Phân trang (9 bài/trang)
- Lọc bài viết theo thẻ tag
- Tìm kiếm bài viết theo từ khóa với debounce 300ms

### Trang chi tiết bài viết
- Hiển thị toàn bộ nội dung bài viết (render Markdown)
- Thông tin tác giả, ngày đăng, danh sách thẻ
- Số lượt xem tự động tăng mỗi lần truy cập
- Phần bài viết liên quan (cùng thẻ, trừ bài đang xem)
- Nút quay lại danh sách

### Trang giới thiệu
- Thông tin tác giả: ảnh đại diện, tên, tiểu sử, kỹ năng, liên kết mạng xã hội

### Quản lý bài viết
- Table hiển thị: Tiêu đề, Trạng thái, Thẻ, Lượt xem, Ngày tạo
- Tìm kiếm theo tiêu đề
- Lọc theo trạng thái (Nháp / Đã đăng)
- Thêm bài viết mới với form: Tiêu đề, Slug, Nội dung, Ảnh đại diện, Thẻ, Trạng thái
- Sửa bài viết
- Xóa bài viết với Popconfirm xác nhận

### Quản lý thẻ
- Danh sách thẻ với tên và số bài viết
- Thêm / Sửa / Xóa thẻ

## Cấu trúc dự án

```
src/pages/Blog/
├── index.tsx          # Trang chủ Blog
├── [slug].tsx         # Chi tiết bài viết
├── About.tsx          # Trang giới thiệu
└── Admin/
    ├── Posts.tsx      # Quản lý bài viết
    └── Tags.tsx       # Quản lý thẻ
```

## API Endpoints

### Bài viết
- `GET /api/blog/posts` - Lấy danh sách bài viết (có phân trang, lọc, tìm kiếm)
- `GET /api/blog/posts/:id` - Lấy chi tiết bài viết theo ID
- `GET /api/blog/posts/slug/:slug` - Lấy chi tiết bài viết theo slug
- `POST /api/blog/posts` - Tạo bài viết mới
- `PUT /api/blog/posts/:id` - Cập nhật bài viết
- `DELETE /api/blog/posts/:id` - Xóa bài viết

### Thẻ
- `GET /api/blog/tags` - Lấy danh sách thẻ
- `POST /api/blog/tags` - Tạo thẻ mới
- `PUT /api/blog/tags/:id` - Cập nhật thẻ
- `DELETE /api/blog/tags/:id` - Xóa thẻ

## Chạy ứng dụng

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run start:dev

# Build production
npm run build
```

## Mock Data

Dữ liệu mock được lưu trong `mock/blog.ts` với các bài viết mẫu và thẻ.

## Công nghệ sử dụng

- React 17
- Ant Design 4.21.0
- UmiJS 3.5.0
- TypeScript
- React Markdown
- Axios
- Lodash