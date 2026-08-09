async function fetchGameData(token, body) {
  console.log("Body: ", body);
  try {
    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": process.env.CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      body: body,
    });

    if (!response.ok) {
      console.error(response);
      throw new Error(`IGDB returned ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
}

module.exports = { fetchGameData };
