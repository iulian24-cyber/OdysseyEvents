export const moderatorOnly = (req, res, next) => {
  if (req.user.role !== "moderator") {
    return res.status(403).json({ message: "Moderators only" });
  }
  next();
};
