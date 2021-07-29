export default {
  notes: async (parnnt, args, { models }) => (
    await models.Note.find()
  ),
  note: async (parent, args, { models }) => (
    await models.Note.findById(args.id)
  ),
};