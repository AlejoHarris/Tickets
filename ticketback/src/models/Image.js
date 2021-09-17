import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

class Image extends Model { }

Image.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ticketId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    url: {
        type: DataTypes.STRING,
    }

}, {
    sequelize,
    modelName: 'Image'
});

export default Image