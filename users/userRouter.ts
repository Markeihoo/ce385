// backend/src/modules/users/userRouter.ts
//1
import express,{ Request, Response } from "express";

import { handleServiceResponse,validateRequest } from "@common/utils/httpHandlers";
import { userService } from "@modules/users/userService";
import { CreateUserSchema,LoginUserSchema } from "@modules/users/userModel";

export const userRouter = (() => {
    const router = express.Router();
    router.post("/register", validateRequest(CreateUserSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const ServiceResponse = await userService.create(payload);
        handleServiceResponse(ServiceResponse, res);
    })
    //21
    router.post("/login", validateRequest(LoginUserSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const ServiceResponse = await userService.login(payload,res);
        handleServiceResponse(ServiceResponse, res);
    })

    return router;
})();