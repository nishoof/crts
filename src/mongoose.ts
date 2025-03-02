import { Schema, model, connect } from 'mongoose';

console.log("mongoose.ts");

const URI = "mongodb+srv://nishilanand21:QLWjPRg0I77ugns3@cluster0.jckjw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  name: string;
  email: string;
  avatar?: string;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String
});

// 3. Create a Model.
const User = model<IUser>('User', userSchema);

export async function run() {
    console.log("mongoose run");
    
  // 4. Connect to MongoDB
  await connect(URI);

  const user = new User({
    name: 'Bill',
    email: 'bill@initech.com',
    avatar: 'https://i.imgur.com/dM7Thhn.png'
  });
  await user.save();

  console.log(user.email); // 'bill@initech.com'
}

run().catch(err => console.log(err));