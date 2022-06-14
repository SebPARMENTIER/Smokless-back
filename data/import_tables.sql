BEGIN;

DROP TABLE IF EXISTS "user",
"smoked",
"day",
"month",
"year";

-- -----------------------------------------------------
-- Table "user"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "user" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "pseudo" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "average" INT NOT NULL,
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
-- Table "smoked"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "smoked" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "quantity" INT NOT NULL,
  "user_id" INT REFERENCES "user" ("id") ON DELETE CASCADE,
  "day_id" INT REFERENCES "day" ("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

COMMIT;