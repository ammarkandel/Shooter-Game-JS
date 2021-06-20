const createGame = async () => {
  const game = {
    name: 'Star Wars - Space Shooter',
  };
  const post = JSON.stringify(game);
  try {
    const address = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/';
    const settings = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: post,
    };
    const response = await fetch(address, settings);
    const answer = await response.json();

    return answer;
  } catch (err) {
    throw err
  }

  return null;
};

const submitHighScore = async (userName, scoreValue) => {
  const submit = {
    user: userName,
    score: scoreValue,
  };
  const post = JSON.stringify(submit);
  try {
    const address = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/A5U9YJkMPINTI5Rnb9Mu/scores/';
    const settings = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: post,
    };
    const response = await fetch(address, settings);
    const answer = await response.json();
    return answer;
  } catch (err) {
    throw err
  }
  return null;
};

const sorting = (obj) => {
  const array = [];
  for (let i = 0; i < obj.length; i += 1) {
    array.push([obj[i].score, obj[i].user]);
  }
  return Array.from(array).sort((a, b) => b[0] - a[0]);
};

const getScoreBoard = async () => {
  try {
    const address = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/A5U9YJkMPINTI5Rnb9Mu/scores/';
    const settings = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(address, settings);
    const answer = await response.json();

    return sorting(answer.result);
  } catch (err) {
    throw err
  }

  return null;
};

export { submitHighScore, getScoreBoard, createGame };
