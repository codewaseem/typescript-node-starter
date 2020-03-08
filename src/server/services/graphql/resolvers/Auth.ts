require("dotenv").config();

import jwt from "jsonwebtoken";
import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { UserClass, UserModel } from "../../database/models/User";
// eslint-disable-next-line no-unused-vars
import { SignUpInput, LoginInput, AuthContext, LoginOutput } from "../types";

let secret = process.env.JWT_SECRET || "some-secret";

@Resolver()
export default class AuthResolver {
  @Query(() => [UserClass])
  async users(): Promise<UserClass[]> {
    return Array.from(await UserModel.find({}));
  }

  @Query(() => UserClass, { nullable: true })
  async me(@Ctx() ctx: AuthContext): Promise<UserClass | undefined | null> {
    return ctx.req.user;
  }

  @Mutation(() => UserClass)
  async register(@Arg("input") input: SignUpInput): Promise<UserClass> {
    let user = await new UserModel(input).save();
    return user as any;
  }

  @Mutation(() => LoginOutput, { nullable: true })
  async login(
    @Arg("input") input: LoginInput
  ): Promise<{ user: UserClass; token: string } | null> {
    let user = await UserModel.findOne({ email: input.email });
    if (!user) return null;

    if (!user.verifyPassword(input.password)) {
      return null;
    }

    let token = jwt.sign(user.toJSON(), secret, {
      expiresIn: "15d",
    });

    return {
      user,
      token,
    };
  }
}
