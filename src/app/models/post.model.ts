// models/post.model.ts
export interface Post {
  id?: string;
  photoUrl: string;
  description?: string;
  likes?: number;
  userId?: string;
}
