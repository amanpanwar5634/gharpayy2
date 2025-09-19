const isSuperAdmin = (req, res, next) => {
    if (req.user.adminType !== "super") {
      return res.status(403).json({ message: "Access denied. Only Superadmin can perform this action." });
    }
    next();
  };
  
  module.exports = isSuperAdmin;
  