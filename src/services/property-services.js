import { Property } from "../models/index.js";

export const createProperty = async (landlordId, data, files) => {
  const {
    title,
    description,
    price,
    state,
    lga,
    address,
    latitude,
    longitude,
  } = data;

  if (!files || files.length === 0) {
    throw new Error("Please upload at least one property image.");
  }

  const images = files.map((file) => ({
    url: file.path,
  }));

  const property = await Property.create({
    landlordId,
    title,
    description,
    price,
    state,
    lga,
    address,
    latitude,
    longitude,
    images,
    isAvailable: true,
    verificationStatus: "PENDING",
  });

  return {
    success: true,
    message: "Property created successfully.",
    data: property,
  };
};
