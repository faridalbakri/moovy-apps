'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FavoriteMovie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FavoriteMovie.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })
    }
  }
  FavoriteMovie.init({
    userId: { type: DataTypes.INTEGER, allowNull: false },
    movieId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    posterPath: { type: DataTypes.STRING, allowNull: false },
    voteAverage: { type: DataTypes.FLOAT, allowNull: false }
  }, {
    sequelize,
    modelName: 'FavoriteMovie',
  });
  return FavoriteMovie;
};