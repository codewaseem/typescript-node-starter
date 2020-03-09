/* eslint-disable no-unused-vars */
import { UserModel, UserClass } from "../models/User";
import { DocumentQuery } from "mongoose";
import { DocumentType } from "@typegoose/typegoose";

class AuthDBGateway implements IAuthDB {
  async getUserByEmail(email: String): Promise<IUser | null> {
    let user = await UserModel.findOne({ email });
    if (!user) return null;
    return user;
  }

  async addUser(input: ISignUpInput): Promise<IUser> {
    let user = new UserModel(input);
    await user.save();
    return user;
  }

  async loginUser(input: ILoginInput): Promise<IUser> {
    let user = (await this.getUserByEmail(input.email)) as DocumentType<
      UserClass
    >;
    if (!user) throw "Invalid login input";

    if (user.verifyPassword(input.password)) {
      return user.toJSON();
    } else {
      throw "Invalid login input";
    }
  }
}

const authDBGateway = new AuthDBGateway();

export default authDBGateway;
