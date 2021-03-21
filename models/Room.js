const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = mongoose.Schema(
  {
    name: {
      type: String
    },
    type: {
      type: String
    },
    participant: []
  },
  { timestamps: true }
);

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;
