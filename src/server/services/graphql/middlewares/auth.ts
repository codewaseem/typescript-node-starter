/* eslint-disable no-unused-vars */
import { AuthContext } from "../types";
import { MiddlewareFn } from "type-graphql";
import { Role } from "../../database/models/User";

export const isAuthorized: MiddlewareFn<AuthContext> = async (
  { context: { req } },
  next
) => {
  if (!req.user) throw "You are not authorized to perform this action";
  return next();
};

export const isModerator: MiddlewareFn<AuthContext> = async (
  { context: { req } },
  next
) => {
  if (req.user && req.user.role == Role.Moderator) return next();
  else throw "You are not authorized to perform this action";
};

export const isAdmin: MiddlewareFn<AuthContext> = async (
  { context: { req } },
  next
) => {
  if (req.user && req.user.role == Role.Admin) return next();
  else throw "You are not authorized to perform this action";
};

export const isModeratorOrAdmin: MiddlewareFn<AuthContext> = async (
  { context: { req } },
  next
) => {
  if (
    req.user &&
    (req.user.role == Role.Moderator || req.user.role == Role.Admin)
  )
    return next();
  else throw "You are not authorized to perform this action";
};
