const router = require("express").Router();

const { checkAuth, isOwner } = require("../middleware/Auth");
const {
    getAllCabins,
    getCabinById,
    addCabin,
    updateCabin,
    deleteCabin,
} = require("../controllers/cabinController");

router.get("/", getAllCabins);
router.get("/:id", getCabinById);
router.post("/", checkAuth, addCabin);
router.patch("/:id", checkAuth, updateCabin);
router.delete("/:id", checkAuth, deleteCabin);

router.use((req, res, next) => {
    const error = new Error("Only GET, POST, PATCH, DELETE commands supported");
    error.status = 500;
    next(error);
});

module.exports = router;
