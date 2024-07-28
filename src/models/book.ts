import { Model, DataTypes, Sequelize } from "sequelize";

class Book extends Model {
  public id!: number;
  public name!: string;
  public averageScore!: number | null;
  public scoreCount!: number;

  public static associate(models: any) {
    Book.belongsToMany(models.User, {
      through: models.Borrow,
      as: "borrowers",
      foreignKey: "bookId",
    });
  }
}

export const initBookModel = (sequelize: Sequelize) => {
  Book.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      averageScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      scoreCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Book",
      tableName: "Books",
    },
  );

  return Book;
};

export default Book;
