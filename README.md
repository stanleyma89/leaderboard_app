# Full Stack Application

This project consists of two main components:

- **API Backend**: A Laravel REST API server
- **Frontend**: A React application built with Vite

## Prerequisites

Before running this application, make sure you have the following installed:

- [PHP](https://www.php.net/) (version 8.1 or higher)
- [Composer](https://getcomposer.org/) (PHP dependency manager)
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) package manager
- [PostgreSQL](https://www.postgresql.org/) (for database)
- [Git](https://git-scm.com/) (for cloning the repository)

## Project Structure

```
project-root/
├── leaderboard-api/                 # Laravel API application
│   ├── composer.json
│   ├── artisan
│   ├── app/
│   ├── config/
│   ├── database/
│   └── ...
├── leaderboard_ui/            # Vite React application
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   └── ...
└── README.md
```

## Getting Started

### 1. Install Dependencies

Install dependencies for both the Laravel API and React frontend:

```bash
# Install Laravel API dependencies
cd leaderboard-api
composer install

# Install frontend dependencies
cd ../leaderboard_ui
npm install
```

## Running the Applications

### Run Applications Separately

#### Running the Laravel API Server

1. Navigate to the API directory:

```bash
cd leaderboard-api
```

2. Copy the environment file and configure it:

```bash
cp .env.example .env
```

3. Generate the application key:

```bash
php artisan key:generate
```

4. Configure your database in the `.env` file, then run migrations:

# Database Configuration

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

```bash
php artisan migrate
```

5. Seed the database:

```bash
php artisan db:seed
```

6. Start the Laravel development server:

```bash
php artisan serve
```

7. Run the unit tests:

```bash
php artisan test
```

8. Check the scheduled jobs:

```bash
php artisan schedule:list
```

9. Check the available routes:

```bash
php artisan route:list
```

The API server will run on `http://localhost:8000` by default.

#### Running the Vite React Application

1. Open a new terminal window/tab and navigate to the frontend directory:

```bash
cd leaderboard_ui
```

2. Start the Vite development server:

```bash
npm run dev
```

The React application will run on `http://localhost:5173` by default.
