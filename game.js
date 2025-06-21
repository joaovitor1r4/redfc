const socket = io();

let players = {};
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

socket.on('currentPlayers', (serverPlayers) => {
    players = serverPlayers;
});

socket.on('newPlayer', (playerInfo) => {
    players[playerInfo.id] = { x: playerInfo.x, y: playerInfo.y };
});

socket.on('playerMoved', (playerData) => {
    if (players[playerData.id]) {
        players[playerData.id].x = playerData.x;
        players[playerData.id].y = playerData.y;
    }
});

socket.on('playerDisconnected', (playerId) => {
    delete players[playerId];
});

document.addEventListener('keydown', (event) => {
    if (players[socket.id]) {
        if (event.key === 'w') players[socket.id].y -= 5;
        if (event.key === 's') players[socket.id].y += 5;
        if (event.key === 'a') players[socket.id].x -= 5;
        if (event.key === 'd') players[socket.id].x += 5;

        socket.emit('playerMovement', players[socket.id]);
    }
});

function drawPlayers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let id in players) {
        let player = players[id];
        ctx.fillStyle = id === socket.id ? 'lime' : 'red';
        ctx.fillRect(player.x, player.y, 20, 20);
    }

    requestAnimationFrame(drawPlayers);
}

drawPlayers();
