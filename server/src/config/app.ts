import express, { Request, Response, NextFunction, } from "express";
import jwt from "express-jwt";
import jwksClient from "jwks-rsa";

export const app = express();

const jwtCheck = jwt({
  secret: jwksClient.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH_ISSUER}.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ["RS256"],
  credentialsRequired: false,
});

// JWT-checking middleware
app.use(jwtCheck, (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code === "invalid_token") {
    return next();
  }
  return next(err);
});
