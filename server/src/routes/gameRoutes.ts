import express from 'express';
import { auth } from '../middlewares/handleAuth';
import { getGame } from '../controllers/game/getGame';
import { getGames } from '../controllers/game/getGames';

export const gameRoutes = express.Router();

gameRoutes.get('/api/get-game', getGame);
gameRoutes.get('/api/get-games/:id', getGames);
