export interface User {
   username: { type: String, unique: true, required: true },
   password: { type: String, required: true },
   email: { type: String, unique: true, required: true },
   name: String,
   token: String,
   profileInfo: {
      birthdate: Date,
      title: String,
      description: String,
   },
   profilePicUrl: String,
   followers: String,
   following: String,
   postPhotos: [String],
};