//backend/src/modules/users/userService.ts
//3
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseStatus, ServiceResponse } from "@common/models/serviceResponse";
import { userRepository } from "@modules/users/userRepository";
import { TypePayloadUser } from "./userModel";
import { users } from "@prisma/client";
import bcrypt from "bcrypt";
import { jwtGenerator } from "@common/utils/jwtGenerator";

export const userService = {
    create: async (payload: TypePayloadUser) => {
        try {
            const checkUser = await userRepository.findByUsername(payload.username);
            if (checkUser) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Username already taken",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const user = await userRepository.create(payload);
            return new ServiceResponse<users>(
                ResponseStatus.Success,
                "User created",
                user,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create user :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    //23
    login: async (payload: TypePayloadUser, res: Response) => {
        try {
            const checkUser = await userRepository.findByUsername(payload.username);
            if (!checkUser) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "User or Password incorrect",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const password = payload.password;
            const passwordDB = checkUser.password;
            const isvalidPassword = await bcrypt.compare(password, passwordDB);
            if (!isvalidPassword) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "User or Password incorrect",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const uuid = checkUser.id;
            const role = checkUser.role;
            const dataPayload = {
                uuid: uuid,
                role: role
            }
            const token = await jwtGenerator.generate(dataPayload);
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "production",
                maxAge : 3600000
            });
            return new ServiceResponse(
                ResponseStatus.Success,
                "Login success",
                null,
                StatusCodes.OK
            );
            
        } catch (ex) {
            const errorMessage = "Error create user :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },



};