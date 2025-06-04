module.exports = function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user; // req.user đã được gán ở middleware xác thực token

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Không có quyền truy cập.' });
    }

    next();
  };
};
