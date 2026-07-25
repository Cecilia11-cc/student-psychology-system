CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Set Chinese locale for full-text search
-- Note: requires Chinese locale to be installed on the PostgreSQL image
