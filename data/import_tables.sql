BEGIN;

DROP TABLE IF EXISTS "user",
"chat",
"message",
"year",
"month",
"day",
"consumption";

-- -----------------------------------------------------
-- Table "user"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "user" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "pseudo" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "average" INT NOT NULL,
  "price" DECIMAL(4, 2) NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

-- -----------------------------------------------------
-- Table "chat"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "chat" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "subject" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

-- -----------------------------------------------------
-- Table "general_message"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "message" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "message" TEXT NOT NULL,
  "user_id" INT REFERENCES "user" ("id") ON DELETE CASCADE,
  "chat_id" INT REFERENCES "chat" ("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

-- -----------------------------------------------------
-- Table "year"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "year" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "year" INT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

-- -----------------------------------------------------
-- Table "month"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "month" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "month" TEXT NOT NULL,
  "year_id" INT REFERENCES "year" ("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

-- -----------------------------------------------------
-- Table "day"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "day" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "day" INT NOT NULL,
  "month_id" INT REFERENCES "month" ("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

-- -----------------------------------------------------
-- Table "consumption"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "consumption" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "quantity" INT NOT NULL,
  "user_id" INT REFERENCES "user" ("id") ON DELETE CASCADE,
  "day_id" INT REFERENCES "day" ("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

COMMIT;