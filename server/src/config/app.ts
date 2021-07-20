import express, { Request, Response, NextFunction } from "express";
import jwksClient from "jwks-rsa";
import { verify } from "jsonwebtoken";

export const app = express();
const issuer = process.env.AUTH0_ISSUER;

// const jwtCheck = jwt({
//   secret: jwksClient.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `${process.env.AUTH_ISSUER}.well-known/jwks.json`,
//   }),
//   audience: process.env.AUTH0_AUDIENCE,
//   issuer: [process.env.AUTH0_ISSUER],
//   algorithms: ["RS256"],
//   credentialsRequired: false,
// });

const simpleJwt = async (req: Request & Record<string, any>, res: Response, next: NextFunction) => {
  if (!issuer) {
    throw new Error("Error loading server");
  }
  const secret = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${issuer}.well-known/jwks.json`,
  });
  const header = req.headers.authorization;
  const token = header ? header.split(" ")[1] : null;
  const keys = await secret.getSigningKeys();
  const kid = keys[0]["kid"];
  const key = await secret.getSigningKey(kid);
  const signingKey = key.getPublicKey();
  if (token) {
    const payload = verify(token, signingKey, { algorithms: ["RS256"] });
    req.user = payload;
  }
  next();
};

app.use(simpleJwt, (err: any, req: Request & Record<string, any>, res: Response, next: NextFunction) => {
  if (err.code === "invalid_token") {
    next();
  }
  return next(err);
});
