const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/user.model");
const Tenant = require("../Models/tenant.model");


const signUp = async (req, res) => {
  try {
    const { name, email, password, role, tenantSlug } = req.body;

   
    const tenant = await Tenant.findOne({ slug: tenantSlug });
    if (!tenant) {
      return res.status(400).json({ success: false, message: "Invalid tenant" });
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      tenant: tenant._id
    });

    await newUser.save();

    return res.status(201).json({ success: true, message: "User signed up successfully" });
  } catch (error) {
    console.error(error.message)
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email }).populate("tenant");
    if (!user) {
      return res.status(401).json({ success: false, message: "User does not exist" });
    }

  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }


    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant._id,
      tenantSlug: user.tenant.slug,
      subscription: user.tenant.subscription
    };


    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1d" });

  
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: "None",
      path: "/",             
      maxAge: 24 * 60 * 60 * 1000,   
    });

    return res.status(200).json({ success: true, message: "Login successful" ,token,
                                    role:user.role,
                                    name:user.name,
                                    tenant:user.tenant,
                                    plan:user.tenant.subscription
                                });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};


const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

module.exports = { signUp, login, logout };
