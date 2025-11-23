// Placeholder for admin authentication middleware
// TODO: Implement JWT verification
export const adminAuth = async (req, res, next) => {
  // For now, allow all requests
  // Later: verify JWT token and check admin role
  next();
};

