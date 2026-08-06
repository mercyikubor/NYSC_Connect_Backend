import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Block = sequelize.define(
    "Block",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      blockerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      blockedId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "blocks",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["blockerId", "blockedId"],
        },
      ],
      validate: {
        cannotBlockSelf() {
          if (this.blockerId === this.blockedId) {
            throw new Error("A user cannot block themselves");
          }
        },
      },
    }
  );

  Block.associate = (models) => {
    Block.belongsTo(models.User, {
      foreignKey: "blockerId",
      as: "blocker",
    });

    Block.belongsTo(models.User, {
      foreignKey: "blockedId",
      as: "blocked",
    });
  };

  return Block;
};