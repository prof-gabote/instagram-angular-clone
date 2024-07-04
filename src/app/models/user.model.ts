export interface User {
   id: string;
   username: string;
   password: string;
   email: string;
   name: string;
   birthdate: string;
   token: string;
   'profile-info': {
      title: string;
      description: string;
      'profile-pic-url': string;
      posts: string;
      followers: string;
      following: string;
   };
}