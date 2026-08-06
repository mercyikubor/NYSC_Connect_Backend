import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Post = sequelize.define(
    "Post",
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
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      media: {
        // Array of Cloudinary URLs
        type: DataTypes.JSON,
        defaultValue: [],
      },
      likesCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      commentsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "posts",
      timestamps: true,
    }
  );

  Post.associate = (models) => {
    Post.belongsTo(models.Community, {
      foreignKey: "communityId",
      as: "community",
    });

    Post.belongsTo(models.User, {
      foreignKey: "userId",
      as: "author",
    });

    Post.hasMany(models.Comment, {
      foreignKey: "postId",
      as: "comments",
      onDelete: "CASCADE",
    });
  };

  return Post;
};