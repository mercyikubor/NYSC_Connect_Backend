import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Community = sequelize.define(
    "Community",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      coverImage: {
        type: DataTypes.STRING,
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
      tableName: "communities",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["state", "lga"],
        },
      ],
    }
  );

  Community.associate = (models) => {
    Community.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "creator",
    });

    Community.hasMany(models.CommunityMember, {
      foreignKey: "communityId",
      as: "members",
      onDelete: "CASCADE",
    });

    Community.hasMany(models.Post, {
      foreignKey: "communityId",
      as: "posts",
      onDelete: "CASCADE",
    });

    Community.hasMany(models.Announcement, {
      foreignKey: "communityId",
      as: "announcements",
      onDelete: "CASCADE",
    });

    Community.hasMany(models.Group, {
      foreignKey: "communityId",
      as: "groups",
      onDelete: "CASCADE",
    });

    Community.hasMany(models.Message, {
      foreignKey: "communityId",
      as: "messages",
      onDelete: "CASCADE",
    });
  };

  return Community;
};