import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "JwtSecret";

export enum ExpireIn {
  "3MIN" = "3m",
  "15MIN" = "15m",
  "30MIN" = "30m",
  "1DAY" = "1d",
  "7DAYS" = "7d",
  "15DAYS" = "15d",
  "30DAYS" = "30d",
}

class TokenManager {
  generateToken(
    payload: any,
    usecase: string = "general",
    options?: jwt.SignOptions
  ) {
    return jwt.sign(payload, JWT_SECRET, { ...options, issuer: usecase });
  }

  verifyToken(
    token: string,
    usecase: string = "general",
    options?: jwt.VerifyOptions
  ) {
    let payload: any = null;
    try {
      payload = jwt.verify(token, JWT_SECRET, {
        ...options,
        issuer: usecase,
      });
    } catch (e) {
      payload = null;
    }
    return payload;
  }
}

export default new TokenManager();
