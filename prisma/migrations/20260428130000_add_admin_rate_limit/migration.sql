CREATE TABLE "admin_rate_limits" (
    "key"                TEXT         NOT NULL,
    "count"              INTEGER      NOT NULL DEFAULT 0,
    "window_started_at"  TIMESTAMP(3) NOT NULL,
    "blocked_until"      TIMESTAMP(3),
    "block_count"        INTEGER      NOT NULL DEFAULT 0,
    "updated_at"         TIMESTAMP(3) NOT NULL,
    CONSTRAINT "admin_rate_limits_pkey" PRIMARY KEY ("key")
);
