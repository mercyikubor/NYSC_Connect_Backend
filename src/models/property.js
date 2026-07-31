import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUID4,
    primaryKey: true,
  },
  landlordId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Landlords',
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lga: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  
  verificationStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
}, {
  indexes: [
    { fields: ['state', 'lga'] },
    { fields: ['isAvailable'] },
    { fields: ['verificationStatus'] },
    { fields: ['price'] },
  ],
});

export default Property;