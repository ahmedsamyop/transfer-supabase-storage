# Transfer Supabase Storage API

Express.js API designed to seamlessly export and import files from Supabase Storage buckets. This application correctly handles deeply nested folder structures, ensuring that your bucket hierarchies are perfectly replicated locally during exports, and correctly uploaded during imports.

## ✨ Features

- **Nested Folder Support**: Recursively traverses Supabase buckets to download all files, maintaining the exact folder structure locally.
- **Bulk Imports**: Scans your local directory recursively and uploads all files into the Supabase bucket while preserving relative paths.
- **MVC Architecture**: Clean code structure separating routing, controllers, and services for easy scalability.
- **RESTful API**: Simple `POST` endpoints to trigger migrations.

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **@supabase/supabase-js** (Supabase official SDK)
- **dotenv** (Environment variable management)

## 📂 Project Structure

```text
├── src/
│   ├── app.js                      # Express application setup
│   ├── config/
│   │   └── supabaseClient.js       # Supabase client initialization
│   ├── controllers/
│   │   ├── exportController.js     # Request/response logic for exports
│   │   └── importController.js     # Request/response logic for imports
│   ├── routes/
│   │   └── storageRoutes.js        # API route definitions
│   └── services/
│       ├── exportService.js        # Core logic for downloading files
│       └── importService.js        # Core logic for uploading files
├── storage/                        # Local directory where files are exported/imported
├── index.js                        # Server entry point
├── .env                            # Environment configurations
└── package.json
```

## ⚙️ Prerequisites

- Node.js (v14 or newer recommended)
- A Supabase Project
- A Supabase Storage Bucket

## ⚙️ Installation & Setup

### Fork

1. **Fork this repository** by clicking the "Fork" button at the top right of this page.
2. **Clone your fork** to your local machine:
   `git clone https://github.com/ahmedsamyop/transfer-supabase-storage.git`

### Installation

**Install Dependencies:**

```bash
npm install
```

### Setup

**Configure Environment Variables**:
Create .env file or Open the `.env` file in the root directory and update it with your Supabase credentials:

```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_service_role_key
SUPABASE_BUCKET_NAME=your_target_bucket
```

> **Note**: It is highly recommended to use the `service_role` key if you want to bypass Row Level Security (RLS) policies for bulk imports/exports.

## 🏃‍♂️ Running the Application

To start the server, run the following command:

```bash
npm start
# or
node index.js
```

## 📖 API Usage

### 1. Health Check

Verify the server is running.

- **Endpoint:** `GET /health`
- **Example:**
  ```bash
  curl http://localhost:3000/health
  ```

### 2. Export Files (Supabase -> Local)

Downloads all files (including those in nested folders) from the specified Supabase bucket to the local `storage/` directory.

- **Endpoint:** `POST /api/storage/export`
- **Body Options (Optional):**
  ```json
  {
    "bucketName": "bucket_name"
  }
  ```
- **Example:**
  ```bash
  curl -X POST http://localhost:3000/api/storage/export \
       -H "Content-Type: application/json" \
       -d '{}'
  ```

### 3. Import Files (Local -> Supabase)

Uploads all files recursively from the local `storage/` directory to the configured Supabase bucket, preserving the local folder structure.

- **Endpoint:** `POST /api/storage/import`
- **Body:**
  ```json
  {
    "bucketName": "bucket_name"
  }
  ```
- **Example:**

  ```bash
  curl -X POST http://localhost:3000/api/storage/import \
       -H "Content-Type: application/json" \
       -d '{}'
  ```

  ## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
