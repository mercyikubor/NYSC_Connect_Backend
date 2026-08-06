import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Announcement = sequelize.define(
    "Announcement",
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
      userId: {
        // Author - must be an admin or community leader.
        // Enforced in the service layer, not at the model level.
        type: DataTypes.UUID,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      pinned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "announcements",
      timestamps: true,
    }
  );

  Announcement.associate = (models) => {
    Announcement.belongsTo(models.Community, {
      foreignKey: "communityId",
      as: "community",
    });

    Announcement.belongsTo(models.User, {
      foreignKey: "userId",
      as: "author",
    });
  };

  return Announcement;
};