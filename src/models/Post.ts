import mongoose, { Document, Model } from "mongoose";
import slugify from "slugify";

export interface PostDocument extends Document {
  title: string;
  content: string;
  author: mongoose.Schema.Types.ObjectId;
  comments: string[];
  slug: string;
  featuredImage?: string;
  createdAt: Date;
}

// Define interface for Bootcamp mongoose model
interface PostModel extends Model<PostDocument> {}

// Mongoose schema definition
const PostSchema = new mongoose.Schema<PostDocument>({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a blog title"],
  },

  content: {
    type: String,
    required: [true, "Please write something! We are intrigued to read"],
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  comments: [
    {
      type: String,
    },
  ],

  slug: String,

  featuredImage: {
    type: String,
    default: "no-photo.jpg",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Slugify middleware
PostSchema.pre<PostDocument>("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Post = mongoose.model<PostDocument, PostModel>("Post", PostSchema);

export default Post;
