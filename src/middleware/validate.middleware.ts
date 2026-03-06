import type { Request, Response, NextFunction } from "express";
import type { ParsedQs } from "qs";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ZodType } from "zod";

type ValidationSchemas = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

export const validate =
  (schemas: ValidationSchemas) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as ParsedQs;
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as ParamsDictionary;
      }
      next();
    } catch (err) {
      next(err);
    }
  };
