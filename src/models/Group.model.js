import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Group = sequelize.define(
    "Group",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      communityId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      membersCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "groups",
      timestamps: true,
    }
  );

  Group.associate = (models) => {
    Group.belongsTo(models.Community, {
      foreignKey: "communityId",
      as: "community",
    });

    Group.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "creator",
    });

    Group.hasMany(models.GroupMember, {
      foreignKey: "groupId",
      as: "members",
      onDelete: "CASCADE",
    });
  };

  return Group;
};