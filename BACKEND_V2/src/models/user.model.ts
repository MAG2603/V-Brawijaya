import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullname: string;
  username: string;
  password: string;
  createdAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
