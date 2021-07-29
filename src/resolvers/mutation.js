export default {
  newNote: async (parent, args, { models }) => (
    await models.Note.create({
      content: args.content,
      author: args.author
    })
  ),
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
};