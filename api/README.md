# Semeru API

A Node.js Express API with TypeScript and Prisma ORM using modular architecture.

## Project Structure

```
src/
├── controllers/     # Request handlers
├── routes/         # Route definitions
├── middlewares/    # Custom middleware
├── services/       # Business logic
├── config/         # Configuration files
├── utils/          # Utility functions
├── generated/      # Generated Prisma client
├── app.ts          # Express app setup
└── server.ts       # Server entry point

prisma/
└── schema.prisma   # Database schema
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   - Update `DATABASE_URL` in `.env` with your database connection string
   - Run migrations:
     ```bash
     npx prisma migrate dev
     ```

3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## Development

Start the development server:
```bash
npm run dev
```

## Production

Build and start:
```bash
npm run build
npm start
```

## API Endpoints

- `GET /health` - Health check

## Technologies

- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- CORS
- Helmet
- Morgan