export const calcNewRatings = (
  rating1: number,
  rating2: number,
  actualScore1: number,
  K: number
): { newRating1: number; newRating2: number } => {
  // Calculate the probability of each player winning
  const P1 = 1.0 / (1.0 + Math.pow(10, (rating2 - rating1) / 400));
  const P2 = 1.0 / (1.0 + Math.pow(10, (rating1 - rating2) / 400));

  // Calculate the new ratings
  const newRating1 = Math.floor(rating1 + K * (actualScore1 - P1));
  const newRating2 = Math.floor(rating2 + K * (1 - actualScore1 - P2));

  return {
    newRating1,
    newRating2,
  };
};

// // Example usage:
// const rating1 = 1200;
// const rating2 = 1000;
// const actualScore1 = 1; // Player 1 wins
// const K = 30;

// const { newRating1, newRating2 } = calculateNewRating(
//   rating1,
//   rating2,
//   actualScore1,
//   K
// );
// console.log(`New rating for player 1: ${newRating1}`);
// console.log(`New rating for player 2: ${newRating2}`);
