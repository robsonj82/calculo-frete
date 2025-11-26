const { Model, DataTypes } = require('sequelize');

class History extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            origin: DataTypes.STRING,
            destination: DataTypes.STRING,
            weight: DataTypes.FLOAT,
            dimensions: DataTypes.STRING, // Format: HxWxL
            value: DataTypes.FLOAT,
            carrier: DataTypes.STRING,
            service: DataTypes.STRING,
            price: DataTypes.FLOAT,
            deadline: DataTypes.INTEGER,
        }, {
            sequelize,
            tableName: 'history',
        });
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
}

module.exports = History;
