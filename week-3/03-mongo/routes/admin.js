const { Router } = require("express");
const { Admin, Course } = require("../db");
const adminMiddleware = require("../middleware/admin");
const router = Router();

// Admin Routes
router.post("/signup", async (req, res) => {
  // Implement admin signup logic
  const username = req.body.username;
  const password = req.body.password;

  try {
    const oldAdmin = await Admin.findOne({ username });
    if (oldAdmin) {
      res
        .status(411)
        .send({ type: "error", status: 411, message: "Admin already exist" });
      return;
    }
  } catch (err) {
    throw new Error();
  }

  const admin = new Admin({ username, password });
  admin.save();

  res.send({ message: "Admin created successfully" });
});

router.post("/courses", adminMiddleware, (req, res) => {
  // Implement course creation logic

  const course = new Course(req.body);
  course.save();

  res.send({
    message: "Course created successfully",
    courseId: course._id,
  });
});

router.get("/courses", adminMiddleware, async (req, res) => {
  // Implement fetching all courses logic
  try {
    const courses = await Course.find({});
    console.log(courses);
    res.status(200).send({ courses: courses });
  } catch (err) {
    throw new Error();
  }
});

module.exports = router;
