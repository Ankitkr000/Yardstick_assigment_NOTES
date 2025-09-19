const Tenant = require("../Models/tenant.model");
const User = require("../Models/user.model");
const jwt = require("jsonwebtoken");

const upgradeTenant = async (req, res) => {
  try {
    let { slug } = req.params;
 slug = slug.trim().toLowerCase();
        
    // const tenant = await Tenant.findOne({ slug });
    const tenant = await Tenant.findOne({ slug: { $regex: `^${slug}$`, $options: "i" } });

    if (!tenant) {
      return res.status(404).json({ 
        success: false, 
        message: "Tenant not found" 
      });
    }


    tenant.subscription = "pro";
    await tenant.save();


    const users = await User.find({ tenant: tenant._id });
    
    const newTokens = users.map(user => {
      const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
        tenantId: tenant._id,
        tenantSlug: tenant.slug,
        subscription: "pro" 
      };
      return {
        userId: user._id,
        token: jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1d" })
      };
    });


    return res.status(200).json({ 
      success: true, 
      message: `Tenant ${tenant.name} upgraded to Pro plan!`,
      newToken: newTokens.find(t => t.userId.toString() === req.user.id)?.token,
      tenantId: tenant._id 
    });
  } catch (error) {
    console.error("Error in upgradeTenant:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};

module.exports = { upgradeTenant };