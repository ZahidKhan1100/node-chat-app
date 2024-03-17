const FriendsModel = require("../models/FriendsModel");
const UserModel = require("../models/UserModel");

async function addFriend(req, res) {
  try {
    const { user1, user2 } = req.body;

    // Check if userId1 and userId2 are not the same
    if (user1 === user2) {
      return res
        .status(400)
        .json({ error: "Cannot send friend request to yourself" });
    }

    // Check if the friend request already exists
    const existingRequest = await FriendsModel.findOne({
      $or: [
        { user1, user2 },
        { user1: user2, user2: user1 }, // Check for reverse order as well
      ],
    });
    if (existingRequest) {
      return res.status(400).json({ error: "Friend request already exists" });
    }

    const friendRequest = new FriendsModel({
      user1,
      user2,
    });
    await friendRequest.save();
    res.status(201).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error adding friend request:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
}

async function FriendsList(req, res) {
    try {
      // Get the profile of the logged-in user
      const userData = await getUserProfile(req.userId);
  
      // Find all friend requests where the logged-in user is either user1 or user2
      const friendRequests = await FriendsModel.find({
        $or: [
          { user1: req.userId },
          { user2: req.userId }
        ]
      });
  
      // Extract the IDs of all friends from the friend requests
      const friendIds = friendRequests.reduce((ids, request) => {
        if (request.user1.toString() === req.userId) {
          ids.push({ userId: request.user2, status: request.status });
        } else {
          ids.push({ userId: request.user1, status: request.status });
        }
        return ids;
      }, []);
  
      // Fetch the details of the friends from the UserModel
      const friendsDetails = await UserModel.find({ _id: { $in: friendIds.map(friend => friend.userId) } }).select('-password -email');
  
      // Combine friend details with status
      const friendsWithStatus = friendsDetails.map(friend => {
        const { userId, status } = friendIds.find(f => f.userId.equals(friend._id));
        return { ...friend.toObject(), status };
      });
      
  
      res.status(200).json({ userData, friends: friendsWithStatus });
    } catch (error) {
      console.error("Error fetching friends list:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
  

async function getUserProfile(UserId) {
  const result = await UserModel.findById(UserId).select('-email -password');
  return result;
}

module.exports = { addFriend, FriendsList };
