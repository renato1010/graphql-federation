import jwksClient from "jwks-rsa";

const simpleJwt = async () => {
  if (!process.env.AUTH_ISSUER) {
    throw new Error("Error loading server");
  }
  const secret = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH_ISSUER}.well-known/jwks.json`,
  });
  console.log({ secret });
};

simpleJwt()
  .then(() => console.log("siempleJwt run ok"))
  .catch((err) => console.log("upsss"));
