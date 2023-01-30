// import { Sequelize } from "sequelize";
import { Model, DataTypes, Optional } from "sequelize";
import db from "../config/Database.js";

interface UserAttributes {
    uuid: string;
    name: string;
    email: string;
    password: string;
}

interface UserCreationAttributes
    extends Optional<UserAttributes, 'uuid'> {}

interface UserInstance
    extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
      id: string;
      createdAt?: Date;
      updatedAt?: Date;
    }

const Users = db.define<UserInstance>('users', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
}, {
    freezeTableName: true
})

export default Users;