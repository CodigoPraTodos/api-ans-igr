import { Request, Response } from "express";

export const index = async (_req: Request, res: Response): Promise<void> => {
    res.send({ info: "https://github.com/CodigoPraTodos/api-ans-igr" });
};
