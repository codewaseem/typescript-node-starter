import { InputType, Field } from "type-graphql";

@InputType()
export class SignUpInput {
  @Field()
  firstName!: string;
  @Field()
  lastName!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;
}
