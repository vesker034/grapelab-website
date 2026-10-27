CREATE TABLE "admin_audit_logs" (
    "id"         SERIAL       NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event"      TEXT         NOT NULL,
    "email"      TEXT,
    "source"     TEXT         NOT NULL,
    CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);
