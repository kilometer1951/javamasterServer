module.exports = (req, res, next) => {
  if (req.user.role === "Orders") {
    return res.redirect("/adminApi/orders");
  }
  next();
};
