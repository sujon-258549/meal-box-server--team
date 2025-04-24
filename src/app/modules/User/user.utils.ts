import User from './user.model';

export const generateUserId = async () => {
  const now = new Date();
  const year = now.getFullYear().toString(); // '2025'
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // '04'

  const prefix = `${year}${month}`; // e.g. '202504'

  const lastUser = await User.findOne(
    { id: { $regex: `^${prefix}` } },
    { id: 1, _id: 0 },
  )
    .sort({ createdAt: -1 })
    .lean();

  let lastSeq = '0000';
  if (lastUser?.id) {
    lastSeq = lastUser.id.slice(-4); // get last 4 digits
  }

  const newSeq = (Number(lastSeq) + 1).toString().padStart(4, '0');
  const newUserId = `${prefix}${newSeq}`;

  return newUserId;
};
