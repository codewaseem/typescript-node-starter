import { prop as DbProp, getModelForClass } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { TimeStamps, Base } from "@typegoose/typegoose/lib/defaultClasses";
import bcrypt from "bcrypt";

@ObjectType()
class UserClass extends TimeStamps implements Base {
  _id!: import("mongoose").Types.ObjectId;
  __v!: number;
  __t: string | number | undefined;

  @Field()
  get id(): string {
    return this._id.toHexString();
  }

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

  @DbProp()
  salt!: string;

  @Field()
  get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  set password(password: string) {
    this.hashed_password = this.encryptPassword(password);
  }

  encryptPassword(password: string) {
    this.salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, this.salt);
  }

  verifyPassword(password: string) {
    return bcrypt.compareSync(password, this.hashed_password);
  }
}

const UserModel = getModelForClass(UserClass);

export { UserClass, UserModel };
