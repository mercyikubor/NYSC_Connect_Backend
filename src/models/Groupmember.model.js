import { DataTypes } from "sequelize";

export default (sequelize) => {
  const GroupMember = sequelize.define(
    "GroupMember",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      groupId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("member", "admin"),
        defaultValue: "member",
      },
      joinedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "group_members",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["groupId", "userId"],
        },
      ],
    }
  );

  GroupMember.associate = (models) => {
    GroupMember.belongsTo(models.Group, {
      foreignKey: "groupId",
      as: "group",
    });

    GroupMember.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return GroupMember;
};