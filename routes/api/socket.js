const Room = require('../../models/Room');
const Message = require('../../models/Message');

const socket = async (server, app) => {
  const io = require('socket.io')(server);

  // Applymiddleware
  io.use((socket, next) => {
    const logged_id = socket.handshake.query.logged_id;
    // Check if not user id
    if (!logged_id) {
      console.error('No user id, authorization denied');
    } else {
      socket.user = logged_id;
      next();
    }
  });

  io.on('connection', (socket) => {
    const id = socket.user;
    console.log('Connected user id is ' + id);
    socket.join(id);
    socket.on('disconnect', () => {
      console.log('Disconnected user id is ' + id);
    });

    socket.on('initPrivateMessage', async ({ logged_id, user_id }) => {
      const participant = [logged_id, user_id].sort();
      const name = participant.join('-');

      const oldroom = await Room.findOne({ name });
      if (oldroom) {
        var room = oldroom;
      } else {
        const newroom = new Room({
          name,
          type: 'private',
          participant
        });
        var room = await newroom.save();
      }
      socket.join(room._id);
      const oldmessage = await Message.findOne({ room_id: room._id });
      if (oldmessage) {
        var messages = oldmessage.messages;
      } else {
        var messages = [];
      }
      console.log(
        'Initiated private message by user id ' +
          user_id +
          ' and room id is ' +
          room._id
      );
      io.to(id).emit('assignedRoomId', { room, messages });
    });

    // socket.on('leaveRoom', ({ chatroomId }) => {
    //   socket.leave(chatroomId);
    //   console.log('A user left chatroom: ' + chatroomId);
    // });

    socket.on('typing', ({ room_id }) => {
      console.log('Typing user id is ' + id + ' and room id is ' + room_id);
      io.to(room_id).emit('typingresponse', { user_id: id });
    });

    socket.on('sendMessage', async ({ room_id, message_type, text }) => {
      if (text.trim().length > 0) {
        const message = {
          text: text,
          user_id: id
        };

        const oldmessage = await Message.findOne({ room_id });
        if (oldmessage) {
          oldmessage.messages.push(message);
          var result = await oldmessage.save();
        } else {
          const newmessage = new Message({
            room_id,
            type: message_type,
            messages: message
          });
          var result = await newmessage.save();
        }

        var res = result.messages.reverse()[0];
        console.log(
          'Sent message by user id ' + id + ' and room id is ' + room_id
        );
        io.to(room_id).emit('newMessage', res);
      }
    });
  });
};

module.exports = socket;
