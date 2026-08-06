import fs from "fs/promises";
import state from "../models/state.js";
import sequelize from "../config/db.js";

const seedStates = async () => {
  try {
    await sequelize.authenticate();

    const file = await fs.readFile(
      new URL("./data/nigerian_states_lgas.json", import.meta.url),
      "utf-8",
    );
    const data = JSON.parse(file);
    for (const item of data) {
      await state.findOrCreate({
        where: { name: item.stateName },
        defaults: { name: item.stateName, capital: null },
      });
    }
    console.log("States seeded successfully");
  } catch (error) {
    console.error("Error seeding states:", error);
    process.exit(1);
  }
};
seedStates();
