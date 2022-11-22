import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof CustomError)
    {
        return res.status(err.statusCode).send({errors: err.serializeErrors()})
    }
    if(err instanceof BadRequestError){
        console.log("handling this error as BadRequestError");
        return res.status(err.statusCode).send({errors:err.serializeErrors()})
    }
    console.error(err)
    res.status(400).send({errors : [{messsage : err.message}] })


}