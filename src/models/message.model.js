import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Message = sequelize.define(
    "Message",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type: {
        // "community" -> community-wide chat, uses communityId
        // "direct"    -> 1:1 DM, uses receiverId
        type: DataTypes.ENUM("community", "direct"),
        allowNull: false,
      },
      communityId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      attachments: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      readAt: {
        // Only meaningful for direct messages
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "messages",
      timestamps: true,
      validate: {
        // Guard against a message that's missing the field its type requires,
        // or that carries a field belonging to the other type.
        matchesType() {
          if (this.type === "community") {
            if (!this.communityId) {
              throw new Error("communityId is required for community messages");
            }
            if (this.receiverId) {
              throw new Error("receiverId must not be set on community messages");
            }
          }

          if (this.type === "direct") {
            if (!this.receiverId) {
              throw new Error("receiverId is required for direct messages");
            }
            if (this.communityId) {
              throw new Error("communityId must not be set on direct messages");
            }
          }
        },
      },
      indexes: [
        { fields: ["communityId", "createdAt"] },
        { fields: ["senderId", "receiverId", "createdAt"] },
      ],
    }
  );

  Message.associate = (models) => {
    Message.belongsTo(models.Community, {
      foreignKey: "communityId",
      as: "community",
    });

    Message.belongsTo(models.User, {
      foreignKey: "senderId",
      as: "sender",
    });

    Message.belongsTo(models.User, {
      foreignKey: "receiverId",
      as: "receiver",
    });
  };

  return Message;
};