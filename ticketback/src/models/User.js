import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs'
import sequelize from '../database';

class User extends Model {
    static encryptPassword = async (password) => {
        return bcrypt.hash(password, bcrypt.genSaltSync(8));
    }
    static decodePassword = async (password, receivedPassword) => { 
        return bcrypt.compare(password, receivedPassword);
    }
}

User.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }/*,
    token: {
        type: DataTypes.STRING,
        allowNull: false
    }*/
}, {
    sequelize,
    modelName: 'User'

}, {
    freezeTableName: true,
});

export default User