const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = mongoose.Schema(
  {
    room_id: {
      type: Schema.Types.ObjectId,
      ref: 'room'
    },
    type: {
      type: String
    },
    messages: [
      {
        text: {
          type: String
        },
        user_id: {
          type: Number
        },
        createdAt: {
          type: Date,
          default: Date.now
        },
        updatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
