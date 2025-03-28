import User from '../db/models/User';

async function updatePlayerRanking(
  playerId: string,
  newRanking: number,
  type: 'bullet' | 'blitz' | 'rapid' | 'classical'
): Promise<void> {
  try {
    const user = await User.findOne({ _id: playerId }).exec();
    if (!user) {
      throw new Error('No player found with the given id');
    }

    const updateDoc = {
      $set: {
        [`rating.${type}`]: newRanking,
      },
    };

    const result = await User.updateOne({ _id: playerId }, updateDoc).exec();

    console.log(
      `Successfully updated the ${type} ranking of player with id ${playerId}`
    );
  } catch (error) {
    console.error(`Failed to update player ranking: ${error}`);
  }
}

export { updatePlayerRanking };
