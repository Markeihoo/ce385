//backend/src/modules/users/userRepository.ts
//4
import { users } from "@prisma/client";
import prisma from "@src/db";

import { TypePayloadUser } from "./userModel";
import bcrypt from "bcrypt";

export const Keys = [
    "id",
    "username",
    "password",
    "role",
    "created_at",
    "updated_at"
];

export const userRepository = {
    findByUsername: async <Key extends keyof users>(
        username: string,
        keys = Keys as Key[]
    ) => {
        return prisma.users.findUnique({
            where: { username: username },
            select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
        }) as Promise<Pick<users, Key> | null>
    },
    create: async (payload: TypePayloadUser) => {
        const username = payload.username.trim();
        const password = payload.password.trim();
        const role = payload.role;

        //hash password
        const sultRound = 10;
        const salt = await bcrypt.genSalt(sultRound);
        const hashPassword = await bcrypt.hash(password, salt);

        const setPayload: any = {
            username: username,
            password: hashPassword,
            role: role
        }
        return await prisma.users.create({
            data: setPayload
        })
    }
}