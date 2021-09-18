import User from "../models/User"
import jwt from 'jsonwebtoken';

const jwtAccess = process.env.JWT_ACCESS;


export const signUp = async (req, res) => {
    const { username, email, password, admin } = req.body;

    const newUser = User.build({
        username,
        id: email,
        password: await User.encryptPassword(password),
        admin
    })
    console.log(newUser)
    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser['id'] }, jwtAccess, {
        expiresIn: (24 * 60 * 60)
    })

    res.status(201).json({ token })

}

export const signIn = async (req, res) => {
    const { email: id, password } = req.body

    const userFound = await User.findByPk(id)

    !userFound ? res.status(400).json({ message: 'User not found' }) : null

    const matchPass = await User.decodePassword(password, userFound.password);

    !matchPass ? res.status(401).json({ message: 'Invalid password', token: null }) : null

    const token = jwt.sign({ id: userFound['id'] }, jwtAccess, {
        expiresIn: (24 * 60 * 60)
    });

    res.status(200).json({token})

}