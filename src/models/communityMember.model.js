import { DataTypes } from "sequelize";

export default (sequelize) => {
  const CommunityMember = sequelize.define(
    "CommunityMember",
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
        type: DataTypes.UUID,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("member", "leader", "admin"),
        defaultValue: "member",
      },
      joinedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "community_members",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["communityId", "userId"],
        },
      ],
    }
  );

  CommunityMember.associate = (models) => {
    CommunityMember.belongsTo(models.Community, {
      foreignKey: "communityId",
      as: "community",
    });

    CommunityMember.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return CommunityMember;
};