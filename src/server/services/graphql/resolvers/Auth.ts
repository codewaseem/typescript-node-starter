/* eslint-disable no-unused-vars */
require("dotenv").config();

import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { classToPlain } from "class-transformer";
import { UserClass, UserModel } from "../../database/models/User";

import {
  SignUpInput,
  LoginInput,
  AuthContext,
  LoginOutput,
  SignUpOutput,
} from "../types";
import { isAuthorized, isModerator } from "../middlewares/auth";

@Resolver()
export default class AuthResolver {
  @UseMiddleware(isModerator)
  @Query(() => [UserClass])
  async users(): Promise<UserClass[]> {
    return Array.from(await UserModel.find({}));
  }

  @Query(() => UserClass, { nullable: true })
  async me(@Ctx() ctx: AuthContext): Promise<UserClass | undefined | null> {
    return ctx.req.user;
  }

  @Mutation(() => SignUpOutput)
  async signUp(
    @Arg("input") input: SignUpInput,
    @Ctx() ctx: AuthContext
  ): Promise<ISignUpOutput> {
    let token = await ctx.authInteractor.signUp(
      classToPlain(input) as ISignUpInput
    );

    return {
      done: Boolean(token),
    };
  }

  @Mutation(() => UserClass, { nullable: true })
  async activateUser(
    @Arg("token") token: string,
    @Ctx() ctx: AuthContext
  ): Promise<IUser | null> {
    return await ctx.authInteractor.activateUser(token);
  }

  @Mutation(() => LoginOutput, { nullable: true })
  async login(
    @Arg("input") input: LoginInput,
    @Ctx() ctx: AuthContext
  ): Promise<ILoginOutput | null> {
    return await ctx.authInteractor.loginWithEmailAndPassword(
      classToPlain(input) as ILoginInput
    );
  }
}
