const jwt = require("jsonwebtoken");
const Tenant = require("../Models/tenant.model");


const auth = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication failed. No token provided or invalid format" 
      });
    }

 
    const token = authHeader.split(' ')[1];

    try {

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        tenantId: decoded.tenantId,
        tenantSlug: decoded.tenantSlug,
        subscription: decoded.subscription
      };
      
      next();
    } catch (err) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication failed. Invalid or expired token" 
      });
    }
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error in authentication" 
    });
  }
};


const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ 
      success: false, 
      message: "Access denied. Admin rights required" 
    });
  }
  next();
};


const checkSubscription = async (req, res, next) => {
    try {
        const { tenantId } = req.user;
        

        const tenant = await Tenant.findById(tenantId);
        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found"
            });
        }
        
  
        if (tenant.subscription === "free") {
            const Note = require("../Models/note.model");
            
            
            const noteCount = await Note.countDocuments({ tenant: tenantId  });
    
    console.log(`Current note count for tenant ${tenantId}: ${noteCount}`);
    
    if (noteCount >= 3) {
        return res.status(403).json({
            success: false,
            message: "Free plan limit reached (3 notes maximum). Please upgrade to Pro plan for unlimited notes."
        });
    }
}

next();
} catch (error) {
    console.error("Subscription Check Error:", error);
    return res.status(500).json({ 
        success: false, 
        message: "Error checking subscription status" 
    });
}
};



module.exports = { auth, isAdmin, checkSubscription };