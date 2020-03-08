import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { UserClass, UserModel } from "../../database/models/User";
// eslint-disable-next-line no-unused-vars
import { SignUpInput, LoginInput } from "../types";

@Resolver()
export default class AuthResolver {
  @Query(() => [UserClass])
  async users(): Promise<UserClass[]> {
    return Array.from(await UserModel.find({}));
  }

  @Mutation(() => UserClass)
  async register(@Arg("input") input: SignUpInput): Promise<UserClass> {
    let user = await new UserModel(input).save();
    return user as any;
  }

  @Mutation(() => UserClass, { nullable: true })
  async login(@Arg("input") input: LoginInput): Promise<UserClass | null> {
    let user = await UserModel.findOne({ email: input.email });
    if (!user) return null;

    if (!user.verifyPassword(input.password)) {
      return null;
    }

    return user;
  }
}
