import { prop as DbProp, getModelForClass } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@ObjectType()
export class UserClass extends TimeStamps {
  @Field()
  readonly id!: string;

  @DbProp({ required: true, trim: true })
  @Field()
  firstName!: string;

  @DbProp({ required: true, trim: true })
  @Field()
  lastName!: string;

  @DbProp({ required: true, trim: true, unique: true })
  @Field()
  email!: string;

  @DbProp()
  hashed_password!: string;
}

export const UserModel = getModelForClass(UserClass);
