const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/demo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Database connected');
}

const playerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  totalGames: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  averageMovesPerGame: { type: Number, default: 0 },
  totalMoves: { type: Number, default: 0 },
  xWins: { type: Number, default: 0 },
  oWins: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  lossRate: { type: Number, default: 0 },
  drawRate: { type: Number, default: 0 },
});

const Player = mongoose.model('Player', playerSchema);
const server = express();

server.use(cors());
server.use(bodyParser.json());

server.post('/game', async (req, res) => {
  const { username, result, moves } = req.body;

  console.log('Incoming data:', req.body); // Log incoming request data

  try {
    let player = await Player.findOne({ username });
    if (!player) {
      player = new Player({ username });
    }

    player.totalGames++;
    player.totalMoves += moves;

    if (result === 'win') {
      player.wins++;
      player.xWins++;
    } else if (result === 'loss') {
      player.losses++;
    } else if (result === 'draw') {
      player.draws++;
    }

    player.averageMovesPerGame = player.totalMoves / player.totalGames;
    player.winRate = (player.wins / player.totalGames) * 100;
    player.lossRate = (player.losses / player.totalGames) * 100;
    player.drawRate = (player.draws / player.totalGames) * 100;

    const doc = await player.save();
    res.json(doc);
  } catch (error) {
    console.error('Error saving player data:', error); // Log any error that occurs
    res.status(500).json({ error: 'Failed to save data' });
  }
});

server.listen(8080, () => {
  console.log('Server started on port 8080');
});
