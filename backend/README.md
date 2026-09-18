# ReProof Backend

ReProof is an AI-powered assessment platform that evaluates learner skills through structured tasks, evidence analysis, and skill-gap reporting across multiple competency levels.

## Technology

- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript

## Installation

```bash
cd backend
npm install
```

## Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` as needed:

```
PORT=5000
```

## Commands

### Development

```bash
npm run dev
```

Starts the server with hot-reload via `tsx watch`.

### Build

```bash
npm run build
```

Compiles TypeScript to `dist/`.

### Production

```bash
npm start
```

Runs the compiled JavaScript from `dist/`.

## Health Endpoint

```
GET http://localhost:5000/api/health
```

Response:

```json
{
  "success": true,
  "message": "ReProof backend is running"
}
```

## Root Endpoint

```
GET http://localhost:5000/
```

Response:

```json
{
  "success": true,
  "message": "ReProof API",
  "version": "1.0.0"
}
```
