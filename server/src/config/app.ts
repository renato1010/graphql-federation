import express, { Request, Response, NextFunction } from "express";
import jwksClient from "jwks-rsa";
import { verify } from "jsonwebtoken";

export const app = express();
const issuer = process.env.AUTH0_ISSUER;

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
    try {
      const payload = verify(token, signingKey, { algorithms: ["RS256"] });
      req.user = payload;
    } catch (error) {
      console.log({ verifyError: error });
    }
  }
  next();
};

app.use(simpleJwt, (err: any, req: Request & Record<string, any>, res: Response, next: NextFunction) => {
  if (err.code === "invalid_token") {
    next();
  }
  next(err);
});
