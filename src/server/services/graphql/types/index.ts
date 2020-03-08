import { InputType, Field, ObjectType } from "type-graphql";
import { Length, IsEmail, Matches, IsUrl } from "class-validator";
import { IsUserAlreadyExist } from "./EmailAlreadyExists";
// eslint-disable-next-line no-unused-vars
import { Request, Response } from "express";
// eslint-disable-next-line no-unused-vars
import { UserClass } from "../../database/models/User";

type RequestWithUser = Request & { user: UserClass | null | undefined };

export interface AuthContext {
  req: RequestWithUser;
  res: Response;
}

@InputType()
export class SignUpInput implements ISignUpInput {
  @Field()
  // @IsUrl()
  client_redirect_url!: string;

  @Length(2, 30)
  @Field()
  firstName!: string;
  @Length(2, 30)
  @Field()
  lastName!: string;

  @IsEmail()
  @Field()
  @IsUserAlreadyExist({ message: "Email already in use." })
  email!: string;

  @Matches(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.\-_*])([a-zA-Z0-9@#$%^&+=*.\-_]){8,}$/
  )
  @Field()
  password!: string;
}

@InputType()
export class LoginInput {
  @Matches(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.\-_*])([a-zA-Z0-9@#$%^&+=*.\-_]){8,}$/
  )
  @Field()
  password!: string;

  @IsEmail()
  @Field()
  email!: string;
}

@ObjectType()
export class LoginOutput {
  @Field()
  user!: UserClass;
  @Field()
  token!: string;
}
