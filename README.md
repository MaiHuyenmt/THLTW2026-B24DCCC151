# WEB BASE V3 - Ứng dụng lập kế hoạch du lịch

## Web base v3 based on:

- React 17, umijs, antd v4
- TypeScript
- SSO with Keycloak
- Back-end: NestJS, PostgreSQL

This project is initialized with [Web Base](https://pro.ant.design). Follow is the quick guide for how to use.

## Tính năng ứng dụng du lịch

Ứng dụng lập kế hoạch du lịch với responsive cho tablet và mobile bao gồm:

### Menu chính: **Du lịch**
- **Khám phá điểm đến** (`/travel/home`): Hiển thị các điểm đến nổi bật dưới dạng card
- **Tạo lịch trình** (`/travel/trip-planner`): Thêm/xóa/sắp xếp điểm đến theo ngày
- **Quản lý ngân sách** (`/travel/budget`): Biểu đồ phân bổ ngân sách và cảnh báo
- **Quản trị** (`/travel/admin`): Quản lý điểm đến và thống kê

### Chi tiết tính năng:

#### 1. Trang chủ - Khám phá điểm đến
- Hiển thị các điểm đến nổi bật dưới dạng card (Ant Design Card) với hình ảnh, địa điểm, rating
- Filter/Sort: Lọc theo loại hình (biển, núi, thành phố), giá cả, đánh giá
- Responsive design cho mobile và tablet

#### 2. Tạo lịch trình du lịch
- Cho phép người dùng thêm/xóa/sắp xếp các điểm đến theo ngày
- Tính toán ngân sách tự động
- Tính toán thời gian di chuyển giữa các điểm
- Drag and drop để sắp xếp thứ tự

#### 3. Quản lý ngân sách
- Hiển thị biểu đồ phân bổ ngân sách cho từng hạng mục (ăn uống, di chuyển, lưu trú...)
- Cảnh báo vượt ngân sách với Alert, Chart, Số liệu
- Cập nhật ngân sách real-time

#### 4. Trang quản trị (Admin)
- Quản lý điểm đến: Thêm/sửa/xóa điểm đến
- Upload hình ảnh điểm đến
- Mỗi điểm đến có thuộc tính: Mô tả, thời gian tham quan, mức chi cho ăn uống, lưu trú, di chuyển, rating
- Thống kê: Xem số lượt lịch trình được tạo theo tháng, địa điểm phổ biến, số tiền thu về

## Environment Prepare

Install `node_modules`:

```bash
yarn
```

## Provided Scripts

RIPT S-Link provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
yarn start
```

### Build project

```bash
yarn build
```

## Environment Prepare

Install `node_modules`:

```bash
yarn
```

## Provided Scripts

RIPT S-Link provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
yarn start
```

### Build project

```bash
yarn build
```
