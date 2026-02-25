# Gym App

## Techonlogies

### FrontEnd

- React
- Tailwindcss

### Backend

- Fastify
- Bun

### Database

- MongoDB
- PostgreSQL

## Database Content

### Postgresql

#### User

This part is for auth & tracking data.

| Name | Datatype |
| ------------- | ------------- |
| id | Serial Primary Key |
| email | text |
| google_id | text |
| password (hashed) | text |
| role | Admin or User |
| created_at | timestamp |
| height | int |
| weight | int |

#### Sessions

| Name | Datatype |
| ------------- | ------------- |
| id | Serial Primary Key |
| user_id | Forgen key |
| exercises | text |
| workout_id | Mongo ID string |
| date | Timestamp |

### Docker Compose file

```bash
services:
  postgres:
    image: postgres:15-alpine
    container_name: gym-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: Username 
      POSTGRES_PASSWORD: Password 
      POSTGRES_DB: gym-postgres
    ports:
      - "5432:5432"
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
  mongodb:
    image: mongo:4.4.18
    container_name: gym-mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: Username 
      MONGO_INITDB_ROOT_PASSWORD: Password 
      MONGO_INITDB_DATABASE: gym-mongo
    ports:
      - "27017:27017"
    volumes:
      - ./data/mongo:/data/db
```
