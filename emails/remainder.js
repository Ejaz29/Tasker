const cron = require('node-cron');
const User = require('./../models/userModel');
const Task = require('./../models/taskModel');
const account = require('./account');

const remind = async (user) => {
  const incomplete = await Task.find({ owner: user._id });

  incomplete.forEach((item, index, incomplete) => {
    const k = item.toObject();
    incomplete[index] = k.description;
  });

  if (incomplete.length === 0) {
    return;
  }
  account.sendmail(user.email, incomplete);
};

cron.schedule(
  '* * * * *',
  async () => {
    console.log('mail sent');
    const users = await User.find();
    users.forEach((element) => {
      remind(element);
    });
  },
  {
    scheduled: true,
    timezone: 'Asia/Kolkata',
  }
);
