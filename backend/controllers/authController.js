const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
  console.log(req.body);
  const { name, email, number, password } = req.body
  try {
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ message: "User Exists" })
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, number, password: hashedPassword })
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      number: user.number,
      role: user.role
    })
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" })
    console.error(error)
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10)
  try {
    const user = await User.findOne({ email });
    const passwordMatch = bcrypt.compare(hashedPassword, user.password)
    if (!user || !passwordMatch)
      return res.status(401).json({ message: "Invalid email or password" });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '7d' })
    res.json({
      token, user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        number: user.number,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.logout = () => {
  localStorage.removeItem('token')
  return { success: true }
}