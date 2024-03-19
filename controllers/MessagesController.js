const FriendsModel = require("../models/FriendsModel");
const UserModel = require("../models/UserModel");
const MessagesModel = require("../models/MessagesModel");
const mongoose = require("mongoose");

async function sendMessage(req, res) {
  try {
    const user1 = req.userId;
    const { user2, message } = req.body;

    const send_message = new MessagesModel({
      user1,
      user2,
      message,
    });

    await send_message.save();
    res.send({ message: "message sent successfully" });
  } catch (error) {
    res.send({ message: error });
  }
}

async function getMessages(req, res) {
  try {
    const userId = req.userId;
    const getMessages = await MessagesModel.aggregate([
      
      {
        $lookup: {
          from: "messages",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$user1", "$$userId"] },
                    { $eq: ["$user2", "$$userId"] },
                  ],
                },
              },
            },
          ],
          as: "userMessages",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          userMessages: 1,
        },
      },
    ]);

    res.send({ getMessages });
  } catch (error) {
    res.send({ message: "server error" });
  }
}

async function getUserProfile(UserId) {
  const result = await UserModel.findById(UserId).select("-email -password");
  return result;
}

module.exports = { sendMessage, getMessages };
