import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';
import dotenv from 'dotenv';
import gravatar from '../utils/gravatar.js';

dotenv.config();

export default {
  newNote: async (parent, args, { models, user }) => {
    if (!user) throw new AuthenticationError('You must be signed in to create a note');
    
    return await models.Note.create({
      content: args.content,
      author: mongoose.Types.ObjectId(user.id)
    })
  },
  updateNote: async (parent, { id, content }, { models }) => (
    await models.Note.findOneAndUpdate(
      { _id: id },
      {
        $set: { content },
      },
      { new: true },
    )
  ),
  deleteNote: async (parent, { id }, { models }) => {
    try {
      await models.Note.findOneAndRemove({ _id: id});
      return true;
    } catch (err) {
      return false;
    }
  },
  signUp: async (parent, { username, email, password }, { models }) => {
    // 이메일 주소 스트링 처리
    email = email.trim().toLowerCase();

    // 비밀번호 해싱
    const hashed = await bcrypt.hash(password, 10);

    // gravata URL
    const avatar = gravatar(email);
    try {
      const user = await models.User.create({
        username,
        email,
        avatar,
        password: hashed,
      });

      // JWT 생성 및 반환
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err);
      throw new Error('Error creating account');
    }
  },
  signIn: async (parent, { email, password }, { models }) => {
    if (email) {
      email = email.trim().toLowerCase();
    }

    const user = await models.User.findOne({ email });

    if (!user) {
      throw new AuthenticationError('Error not a user');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthenticationError('Error invalid password');
    }

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },
};