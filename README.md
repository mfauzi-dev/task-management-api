# Task Management API

Task Management API adalah RESTful API berbasis Express.js dan Sequelize (MySQL) yang mendukung autentikasi JWT, role-based authorization, dan manajemen task untuk user dan admin.

## Tech Stack

-   **Node.js**
-   **Express.js**
-   **MySQL**
-   **Sequelize ORM**
-   **JWT (Access & Refresh Token)**
-   **bcrypt**
-   **Winston Loggerg**
-   **Joi Validation**

## User Features

-   **Register**
-   **Login**
-   **Get profile**
-   **Update profile**
-   **Update Password**

## Task Features

### Member

-   **Create task**
-   **Get task miliknya sendiri**
-   **Get detail task miliknya sendiri**
-   **Update task miliknya sendir**
-   **Delete task miliknya sendiri**

### Admin

-   **Create task**
-   **Get task miliknya sendiri dan semua user**
-   **Get detail task miliknya sendiri dan semua user**
-   **Update task miliknya sendiri dan semua user**
-   **Delete task miliknya sendiri dan semua user**

## **Clone repository**

```bash
git clone https://github.com/mfauzi-dev/task-management-api.git
```

## **Setup Project Baru**

1. **Rename folder sesuai project baru**

    ```bash
    mv user-authentication-api-v2 my-new-project
    cd my-new-project
    ```

2. **Hapus riwayat Git lama**

    ```bash
    rm -rf .git
    ```

3. **Install dependencies**

    ```bash
    npm install
    ```

4. **Buat file .env berdasarkan .env.example**

    ```bash
    cp .env.example .env
    ```

5. **Jalankan project**

    ```bash
    npm run dev
    ```

## Teknologi

-   Express.js

-   Sequelize

-   MySQL

-   JWT

-   bcrypt

## Lisensi

Proyek ini menggunakan lisensi MIT.  
Lihat file [LICENSE](LICENSE) untuk detailnya.
