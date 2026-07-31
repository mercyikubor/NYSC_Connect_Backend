import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Landlord = sequelize.define('Landlord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUID4,
    primaryKey: true,
  },

  
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Landlord;