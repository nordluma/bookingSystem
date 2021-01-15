const router = require("express").Router();

const { checkAuth, isOwner } = require("../middleware/Auth");
const {
    getAllAdverts,
    getAdvertById,
    addAdvert,
    updateAdvert,
    deleteAdvert,
} = require("../controllers/advertController");

router.get("/", getAllAdverts);
router.get("/:id", getAdvertById);
router.post("/", checkAuth, addAdvert);
router.patch("/:id", checkAuth, updateAdvert);
router.delete("/:id", checkAuth, deleteAdvert);

router.use((req, res, next) => {
    const error = new Error("Only GET, POST, PATCH, DELETE commands supported");
    error.status = 500;
    next(error);
});

module.exports = router;
