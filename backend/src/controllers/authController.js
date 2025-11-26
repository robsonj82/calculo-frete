/**
 * Auth Controller
 * Handles user registration and login
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
};

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({
                status: 'error',
                message: 'Usuário já cadastrado com este email'
            });
        }

        // Create user
        const user = await User.create({
            nome: name,
            email,
            senha_hash: password,
            perfil: role || 'operador'
        });

        // Generate token
        const token = generateToken(user.id);

        // Remove password from response
        const userResponse = user.toJSON();
        delete userResponse.senha_hash;

        res.status(201).json({
            status: 'success',
            data: {
                user: userResponse,
                token
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erro ao registrar usuário',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Por favor, forneça email e senha'
            });
        }

        // Find user
        const user = await User.findOne({ where: { email } });

        // Check if user exists and password is correct
        if (!user || !(await user.checkPassword(password))) {
            return res.status(401).json({
                status: 'error',
                message: 'Credenciais inválidas'
            });
        }

        // Generate token
        const token = generateToken(user.id);

        // Remove password from response
        const userResponse = user.toJSON();
        delete userResponse.senha_hash;

        res.status(200).json({
            status: 'success',
            data: {
                user: userResponse,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erro ao realizar login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['senha_hash'] }
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuário não encontrado'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro ao buscar dados do usuário'
        });
    }
};

module.exports = {
    register,
    login,
    getMe
};
