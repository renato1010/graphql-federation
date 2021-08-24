import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface UserProfile {
  accountId: string;
  avatar?: string;
  description?: string;
  following: Schema.Types.ObjectId[];
  fullName?: string;
  username: string;
}
// 2. Create a Schema corresponding to the document interface.
const profileSchema = new Schema<UserProfile>({
  accountId: {
    type: String,
    required: true,
  },
  avatar: { type: String },
  description: { type: String, maxlength: 256 },
  following: [Schema.Types.ObjectId],
  fullName: { type: String, trim: true },
  username: { type: String, required: true, trim: true, unique: true },
});

// 3. Create a Model.
export const Profile = model<UserProfile>("Profile", profileSchema);
