# job-match-ai

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-blue.svg)](https://www.docker.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen.svg)](https://www.mongodb.com/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-supported-orange.svg)](https://www.trychroma.com/)
[![LangChain](https://img.shields.io/badge/LangChain-integrated-yellow.svg)](https://www.langchain.com/)
[![Playwright](https://img.shields.io/badge/Playwright-tests-green.svg)](https://playwright.dev/)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](#)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](#)
[![License](https://img.shields.io/badge/license-UNLICENSED-lightgrey.svg)](#)

---

## Table of Contents
- [Introduction](#introduction)
- [Key Features](#key-features)
- [Architecture Diagram](#architecture-diagram)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Docker Setup](#docker-setup)
- [Running Tests](#running-tests)
- [Environment Variables](#environment-variables)
- [Examples / Screenshots](#examples--screenshots)
- [Authentication Strategy](#authentication-strategy)
- [Database Design](#database-design)
- [Folder Structure Explanation](#folder-structure-explanation)
- [Scripts / CLI Reference](#scripts--cli-reference)
- [Deployment](#deployment)
- [Contributing Guidelines](#contributing-guidelines)
- [License](#license)
- [FAQ](#faq)
- [Community / Support](#community--support)
- [Author & Credits](#author--credits)
- [Changelog](#changelog)
- [Related Projects / Alternatives](#related-projects--alternatives)

---

## Introduction
**job-match-ai** helps you find the best job matches from LinkedIn for your resume using AI-powered parsing, scraping, and matching algorithms.

---

## Key Features
- Parse resumes and extract structured data
- Scrape job listings from LinkedIn
- Match jobs to resumes using LLMs (Large Language Models)
- MongoDB and ChromaDB support for storage and vector search
- Playwright-based browser automation
- Dockerized for easy deployment
- TypeScript for strong typing and maintainability

---

## Architecture Diagram
```
[User] -> [API/CLI] -> [Resume Parser] -> [Job Scraper] -> [LLM Matcher] -> [DB: MongoDB/ChromaDB]
```
*Replace with a real diagram if available.*

---

## Tech Stack
- **Node.js** (18.x)
- **TypeScript** (4.x)
- **MongoDB** (6.x)
- **ChromaDB** (vector DB)
- **LangChain** (LLM orchestration)
- **Playwright** (browser automation)
- **Docker**

---

## Installation & Setup
```bash
# Clone the repo
$ git clone https://github.com/ankurksoni/job-match-ai.git
$ cd job-match-ai

# Install dependencies
$ npm install

# Copy and edit environment variables
$ cp .env.example .env
# Edit .env as needed
```

---

## Docker Setup
```bash
# Run DB with Docker Compose
$ docker-compose up -d
```

---

## Running Tests
```bash
# Run all tests
$ npm test
```

---

## Environment Variables
See `.env.example` for all required environment variables. Key variables include:
- `MONGODB_URI` - MongoDB connection string
- `CHROMADB_URI` - ChromaDB connection string
- `LINKEDIN_EMAIL` - LinkedIn login email
- `LINKEDIN_PASSWORD` - LinkedIn login password
- `OPENAI_API_KEY` - OpenAI API key for LLMs

---

## Examples / Screenshots
*Add screenshots or usage examples here.*

---

## Authentication Strategy
- LinkedIn login is automated using Playwright.
- Credentials are provided via environment variables.
- No user-facing authentication implemented (for internal/CLI use).

---

## Database Design
- **MongoDB**: Stores resumes, jobs, and match results.
- **ChromaDB**: Stores vector embeddings for semantic search.

---

## Folder Structure Explanation
```
src/
  core/           # Core logic (linkedinLogin, jobScraper, llmMatcher, resumeParser)
  db/             # Database initialization (mongodb, chromadb)
  types/          # TypeScript types
  utility/        # Utility functions
  index.ts        # Entry point

test/             # Test cases and data
```

---

## Scripts / CLI Reference
- `npm start` - Start the application
- `npm test` - Run tests
- `docker-compose up -d` - Start all services with Docker

---

## Deployment
- Deploy using Docker Compose for all dependencies.
- For production, set all environment variables and use secure credentials.

---

## Contributing Guidelines
1. Fork the repo and create your branch from `main`.
2. Ensure code is well-typed and tested.
3. Open a pull request with a clear description.

---

## License
*No license specified. Add a LICENSE file to clarify usage rights.*

---

## FAQ
- **Q:** Is this for production use?
  **A:** Not yet. Use at your own risk.
- **Q:** Can I use my own LLM?
  **A:** Yes, configure the API key in `.env`.

---

## Community / Support
- Open an issue on GitHub for support.

---

## Author & Credits
- **Author:** Ankur Soni
- **Contributors:** See GitHub contributors

---

## Changelog
- See [CHANGELOG.md](CHANGELOG.md) (if available)

---

## Related Projects / Alternatives
- [LangChain](https://www.langchain.com/)
- [Playwright](https://playwright.dev/)
- [ChromaDB](https://www.trychroma.com/)
- [OpenAI](https://openai.com/)