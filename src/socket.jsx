import io from 'socket.io-client'

// const socket = io('http://localhost:3000');
// const socket = io('https://duke-game-backend.vercel.app/api/');
const socket = io('/socket.io/',{
    ws: true,
});
export default socket;