-- CreateEnum
CREATE TYPE "GroupMemberRole" AS ENUM ('OWNER', 'MEMBER');

-- AlterTable
ALTER TABLE "GroupMember" ADD COLUMN     "role" "GroupMemberRole" NOT NULL DEFAULT 'MEMBER';
