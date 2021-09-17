import jwt from 'jsonwebtoken';
import User from '../models/User';
const jwtAccess = process.env.JWT_ACCESS;

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"]
        !token ? res.status(403).json({ message: 'No Token' }) : null;
        const decoded = jwt.verify(token, jwtAccess);
        req.userId = decoded['id']
        const user = await User.findByPk(req.userId);
        !user ? res.status(404).json({ message: 'User not found' }) : null;
        next();
    }
    catch (error) {
        res.status(500).json({ message: "Unauthorized" })
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const isAdmin = user['admin'];
        req.isAdmin = isAdmin;
        if (!req.isAdmin) res.status(403).json({message: "Admin Only"})        
        next();
    } catch (error) {
        res.status(500).json({ message: error })
    }
}
