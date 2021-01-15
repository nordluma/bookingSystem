const router = require("express").Router();

const {
    getAllUsers,
    updateUser,
    deleteUser,
    userSignup,
    userLogin,
    userLogout,
} = require("../controllers/userController");
const { checkAuth } = require("../middleware/Auth");

router.get("/", getAllUsers);
router.patch("/:id", checkAuth, updateUser);
router.delete("/:id", checkAuth, deleteUser);
router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/logout", checkAuth, userLogout);

router.use((req, res, next) => {
    const error = new Error("Only GET, POST, PATCH, DELETE commands supported");
    error.status = 500;
    next(error);
});

module.exports = router;
