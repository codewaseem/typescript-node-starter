import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { UserClass, UserModel } from "../../database/models/User";
import { SignUpInput } from "../types";

@Resolver(UserClass)
export default class AuthResolver {
  @Query(() => UserClass, { nullable: true })
  async user(@Arg("id") id: string): Promise<UserClass | null> {
    return await UserModel.findById(id);
  }

  @Query(() => [UserClass])
  async users(): Promise<UserClass[]> {
    return Array.from(await UserModel.find({}));
  }

  @Mutation(() => UserClass)
  async register(@Arg("input") input: SignUpInput): Promise<UserClass> {
    let user = await new UserModel(input).save();
    return user;
  }
}
