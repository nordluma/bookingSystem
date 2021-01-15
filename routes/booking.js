const router = require("express").Router();

const { checkAuth, isOwner } = require("../middleware/Auth");
const { checkDates } = require("../middleware/collidingDates");
const {
    getAllBookings,
    getBookingById,
    addBooking,
    updateBooking,
    deleteBooking,
} = require("../controllers/bookingController");

router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.post("/", checkAuth, checkDates, addBooking);
router.patch("/:id", checkAuth, checkDates, updateBooking);
router.delete("/:id", checkAuth, deleteBooking);

router.use((req, res, next) => {
    const error = new Error("Only GET, POST, PATCH, DELETE commands supported");
    error.status = 500;
    next(error);
});

module.exports = router;
