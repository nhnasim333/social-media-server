
import { TPost } from "./post.interface";
import { Post } from "./post.model";

const createPostIntoDB = async (payload: TPost) => {
  const result = await Post.create(payload);
  return result;
};

const getAllPostFromDB = async (query: Record<string, unknown>) => {
  const searchTerm = query.searchTerm as string | undefined;
  const userCollection = "users"; 

  const pipeline: any[] = [
    {
      $lookup: {
        from: userCollection,
        localField: "userId",
        foreignField: "_id",
        as: "userId"
      }
    },
    {
      $unwind: "$userId"
    }
  ];

  if (searchTerm) {
    pipeline.push({
      $match: {
        $or: [
          { postText: { $regex: searchTerm, $options: "i" } },
          { "userId.username": { $regex: searchTerm, $options: "i" } },
          { "userId.name": { $regex: searchTerm, $options: "i" } }
        ]
      }
    });
  }

  pipeline.push({ $sort: { createdAt: -1 } });

  const result = await Post.aggregate(pipeline);

  return result;
};

const getAllPostByUserIdFromDB = async (userId: string) => {
  const result = await Post.find({ userId })
    .populate("userId")
    .sort({ createdAt: -1 });
  return result;
};

const deletePostFromDB = async (postId: string) => {
  const result = await Post.findByIdAndDelete(postId);
  return result;
};
const updatePostFromDB = async (postId: string, post: Partial<TPost>) => {
  // console.log(post);
  const result = await Post.findByIdAndUpdate(postId, post, { new: true });
  return result;
};

export const PostServices = {
  createPostIntoDB,
  getAllPostFromDB,
  deletePostFromDB,
  updatePostFromDB,
  getAllPostByUserIdFromDB,
};
