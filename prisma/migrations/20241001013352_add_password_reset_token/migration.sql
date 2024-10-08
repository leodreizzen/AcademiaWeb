-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "token_hash" TEXT NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dni" INTEGER NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("token_hash")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_dni_key" ON "PasswordResetToken"("dni");

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_dni_fkey" FOREIGN KEY ("dni") REFERENCES "User"("dni") ON DELETE CASCADE ON UPDATE CASCADE;
