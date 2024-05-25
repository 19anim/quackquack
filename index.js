const axios = require("axios");

const config = {
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM2Mzk3OSwidGltZXN0YW1wIjoxNzE2NTYxMzg4OTAzLCJ0eXBlIjoxLCJpYXQiOjE3MTY1NjEzODgsImV4cCI6MTcxNzE2NjE4OH0.Tn7VRq5O3r9tq3uoanEUMsyE4qQOs4JeH0coYWdAmsc",
  },
};

const duckId = [6331986, 6315935, 6317358, 6332603, 6344010, 6359924, 6309444];

const harvestEgg = async () => {
  try {
    const listReload = await axios.get(
      "https://api.quackquack.games/nest/list-reload",
      config
    );
    const arrayOfNestInfor = listReload.data.data.nest;
    const arrayOfNestReadyToHarvest = [];

    arrayOfNestInfor.forEach((nestInfor) => {
      if (nestInfor.status == 2) arrayOfNestReadyToHarvest.push(nestInfor.id);
    });
    console.log("Harvest-able Nests: ", arrayOfNestReadyToHarvest);

    if (arrayOfNestReadyToHarvest.length > 0) {
      await axios.post(
        "https://api.quackquack.games/nest/collect",
        { nest_id: arrayOfNestReadyToHarvest[0] },
        config
      );
      console.log("Nest just harvested: ", arrayOfNestReadyToHarvest[0]);
    }

    const game = await axios.get(
      "https://api.quackquack.games/balance/get",
      config
    );

    await getBonus();
    console.log("Balance: ", game.data.data.data[2].balance);
    console.log(
      "============================================================="
    );
    // const randomDuck = duckId[Math.floor(Math.random() * 7)];
    // console.log("RANDOM_DUCK_ID: ", randomDuck);
  } catch (error) {
    console.log(error.message);
  }
};

const getBonus = async () => {
  try {
    const goldenEgg = await axios.get(
      "https://api.quackquack.games/golden-duck/info",
      config
    );
    const currentTimeStamp = goldenEgg.data.data.timestamp;
    const timeTillGoldenDuck = goldenEgg.data.data.time_to_golden_duck;
    const dateTillGoldenDuck = new Date(
      (currentTimeStamp + timeTillGoldenDuck) * 1000
    ).toLocaleString("vi-VN");
    console.log("Time to collect golden egg: ", dateTillGoldenDuck);

    if (timeTillGoldenDuck <= 0) {
      const bonus = await axios.get(
        "https://api.quackquack.games/golden-duck/reward",
        config
      );
      console.log("bonus: ", bonus.data);
      const collect = await axios.post(
        "https://api.quackquack.games/golden-duck/claim",
        { type: 1 },
        config
      );
      console.log("collect: ", collect.data);
    }
  } catch (error) {
    console.log("Error in collecting golden egg");
  }
};

const layEgg = async (nestId, duckId) => {
  try {
    const layEggPost = await axios.post(
      "https://api.quackquack.games/nest/lay-egg",
      { nest_id: 1032841, duck_id: 6359924 },
      config
    );
    console.log(layEggPost.data);
  } catch (error) {
    console.log(error.message);
  }
};

setInterval(harvestEgg, 4000);
//layEgg();
