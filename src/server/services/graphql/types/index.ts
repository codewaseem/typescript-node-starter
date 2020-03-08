import { InputType, Field } from "type-graphql";
import { Length, IsEmail, Matches } from "class-validator";
import { IsUserAlreadyExist } from "./EmailAlreadyExists";

@InputType()
export class SignUpInput {
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
