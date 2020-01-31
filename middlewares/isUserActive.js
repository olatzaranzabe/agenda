module.exports = (req, res, next) => {
    console.log(req.user);
    console.log(req.user.status);
    //if (req.user.status === "Active")
    return next();

    return res.status(403).json({ message: "El usuario no está activo" });
};
