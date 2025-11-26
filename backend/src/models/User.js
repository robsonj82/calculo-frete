const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            nome: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            senha_hash: {
                type: DataTypes.STRING,
                allowNull: false
            },
            perfil: {
                type: DataTypes.ENUM('administrador', 'operador'),
                defaultValue: 'operador',
                allowNull: false
            },
            ativo: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            }
        }, {
            sequelize,
            tableName: 'usuarios',
            timestamps: true,
            createdAt: 'criado_em',
            updatedAt: 'atualizado_em',
            hooks: {
                beforeCreate: async (user) => {
                    if (user.senha_hash) {
                        const salt = await bcrypt.genSalt(10);
                        user.senha_hash = await bcrypt.hash(user.senha_hash, salt);
                    }
                },
                beforeUpdate: async (user) => {
                    if (user.changed('senha_hash')) {
                        const salt = await bcrypt.genSalt(10);
                        user.senha_hash = await bcrypt.hash(user.senha_hash, salt);
                    }
                }
            }
        });
    }

    async checkPassword(password) {
        return await bcrypt.compare(password, this.senha_hash);
    }

    static associate(models) {
        // Define associations here if needed
    }
}

module.exports = User;
