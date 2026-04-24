const bcrypt = require("bcrypt");
const { DataTypes, Model } = require("sequelize");

const BCRYPT_ROUNDS = 10;

class User extends Model { }

function initUser(sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: true
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      password: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.getDataValue("password");   // ← ADD THIS
        },
        set(value) {
          this.setDataValue("password", value);
        }
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      defaultScope: {
        attributes: { exclude: ["passwordHash"] }
      },
      scopes: {
        withPasswordHash: {
          attributes: { include: ["passwordHash"] }
        }
      },
      hooks: {
        async beforeCreate(user) {
          if (user.password) {
            if (String(user.password).length < 6) {
              throw new Error("Password must be at least 6 characters");
            }
            user.passwordHash = await bcrypt.hash(String(user.password), BCRYPT_ROUNDS);
          }
        },
        async beforeUpdate(user) {
          if (user.password) {
            if (String(user.password).length < 6) {
              throw new Error("Password must be at least 6 characters");
            }
            user.passwordHash = await bcrypt.hash(String(user.password), BCRYPT_ROUNDS);
          }
        }
      }
    }
  );

  User.prototype.toJSON = function toJSON() {
    const values = { ...this.get() };
    delete values.passwordHash;
    delete values.password;
    return values;
  };

  return User;
}

module.exports = { User, initUser };

