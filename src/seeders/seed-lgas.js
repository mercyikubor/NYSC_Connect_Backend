import fs from "fs/promises";
import sequelize from "../config/db.js";
import State from "../models/state.js";
import LGA from "../models/lga.js";

const seedLGAs = async () => {
  try {
    await sequelize.authenticate();

    const file = await fs.readFile(
      new URL("./data/nigerian_states_lgas.json", import.meta.url),
      "utf-8",
    );

    const data = JSON.parse(file);

    for (const item of data) {
      const state = await State.findOne({
        where: { name: item.stateName },
      });

      if (!state) {
        console.log(`State ${item.stateName} not found`);
        continue;
      }

      for (const lga of item.lgas) {
        await LGA.findOrCreate({
          where: {
            name: lga,
            stateId: state.id,
          },
          defaults: {
            name: lga,
            stateId: state.id,
          },
        });
      }
    }

    console.log("✅ LGAs seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedLGAs();
