const { Router } = require("express");
const { Admin, JWT_PASSWORD, Course } = require("../db");
const jwt = require("jsonwebtoken");
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

router.post("/signin", async (req, res, err) => {
  // Implement admin signin logic
  const admin = req.body;

  try {
    const adminFind = await Admin.findOne(admin);
    if (!adminFind) {
      res.status(401).send({
        type: "error",
        status: 401,
        message: "Invalid credentials",
      });
      return;
    }

    const token = jwt.sign({ username: admin.username }, JWT_PASSWORD);
    res.status(200).send(token);
  } catch (err) {
    next(err);
  }
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

router.get("/courses", adminMiddleware, async (req, res, next) => {
  // Implement fetching all courses logic
  try {
    const courses = await Course.find({});
    console.log(courses);
    res.status(200).send({ courses: courses });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
