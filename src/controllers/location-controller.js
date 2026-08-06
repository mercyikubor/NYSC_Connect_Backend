import State from "../models/state.js";
import LGA from "../models/lga.js";

export const getStates = async (req, res) => {
  try {
    const states = await State.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    res.status(200).json(states);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch states",
      error: error.message,
    });
  }
};

export const getLGAsByState = async (req, res) => {
  try {
    const { stateId } = req.params;

    const lgas = await LGA.findAll({
      where: { stateId },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    res.status(200).json(lgas);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch LGAs",
      error: error.message,
    });
  }
};
