import { Op } from 'sequelize';
import { Property, Landlord } from '../models/index.js';
import { cloudinary } from '../config/cloudinary.js';

export const createProperty = async (req, res) => {
  try {
    const images = req.files
      ? req.files.map((file) => ({
          url: file.path,
          public_id: file.filename,
        }))
      : [];

    const property = await Property.create({
      ...req.body,
      landlordId: req.user.id,
      images,
      verificationStatus: 'pending',
    });

    res.status(201).json({ success: true, data: property });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getProperties = async (req, res) => {
  try {
    const { state, lga, minPrice, maxPrice, isAvailable, page = 1, limit = 10 } = req.query;

    const whereClause = {
      verificationStatus: 'approved',
    };

    if (state) whereClause.state = { [Op.iLike]: `%${state}%` }; 
    if (lga) whereClause.lga = { [Op.iLike]: `%${lga}%` };
    if (isAvailable !== undefined) whereClause.isAvailable = isAvailable === 'true';

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = Number(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = Number(maxPrice);
    }

    const offset = (page - 1) * limit;

    const { count, rows: properties } = await Property.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Landlord,
          as: 'landlord',
          attributes: ['id', 'name', 'email', 'phone'],
        },
      ],
      limit: Number(limit),
      offset: Number(offset),
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: properties.length,
      total: count,
      page: Number(page),
      pages: Math.ceil(count / limit),
      data: properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id, {
      include: [
        {
          model: Landlord,
          as: 'landlord',
          attributes: ['id', 'name', 'email', 'phone'],
        },
      ],
    });

    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    if (property.landlordId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const resetFields = ['title', 'description', 'price', 'address', 'state', 'lga'];
    const hasCoreUpdate = resetFields.some((field) => req.body[field] !== undefined);

    const updateData = { ...req.body };
    if (hasCoreUpdate) {
      updateData.verificationStatus = 'pending';
    }

    await property.update(updateData);

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    if (property.landlordId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (property.images && Array.isArray(property.images)) {
      for (const img of property.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    await property.destroy();
    res.status(200).json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const verifyProperty = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    await property.update({
      verificationStatus: status,
      rejectionReason: status === 'rejected' ? rejectionReason || 'Failed verification' : null,
    });

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};