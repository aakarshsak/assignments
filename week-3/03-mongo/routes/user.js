const { Router } = require("express");
const { User, Course } = require("../db");
const router = Router();
const userMiddleware = require("../middleware/user");

// User Routes
router.post("/signup", async (req, res) => {
  // Implement user signup logic
  const username = req.body.username;
  const password = req.body.password;
  try {
    const oldUser = await User.findOne({ username });
    if (oldUser) {
      res
        .status(411)
        .send({ type: "error", status: 411, message: "User already exist" });
      return;
    }
  } catch (err) {
    throw new Error();
  }

  const user = new User({ username, password });
  user.save();

  res.send({ message: "User created successfully" });
});

router.get("/courses", userMiddleware, async (req, res) => {
  // Implement listing all courses logic
  try {
    const courses = await Course.find({});
    res.status(200).send({ courses });
  } catch (err) {
    throw new Error();
  }
});

router.post("/courses/:courseId", userMiddleware, async (req, res, next) => {
  // Implement course purchase logic
  const id = req.params.courseId;

  try {
    const course = await Course.findOne({ _id: id });

    const user = req.user;
    if (user.purchasedCourses.includes(course._id)) {
      res.status(411).send({
        type: "error",
        status: 404,
        message: "Course already purchased",
      });
      return;
    }
    user.purchasedCourses.push(course);
    user.save();
  } catch (err) {
    res.status(404).send({
      type: "error",
      status: 404,
      message: "Invalid Course Id / not found",
    });
    return;
  }

  res.send({ message: "Course purchased successfully" });
});

router.get("/purchasedCourses", userMiddleware, async (req, res, next) => {
  // Implement fetching purchased courses logic
  try {
    const user = await User.findOne({ username: req.headers.username });

    let courses = [];
    for (let i = 0; i < user.purchasedCourses.length; i++) {
      console.log("COurse", user.purchasedCourses[i]);
      const c = await Course.findOne({ _id: user.purchasedCourses[i] });
      console.log(c);
      courses.push(c);
      console.log(courses);
    }
    res.send({ purchasedCourses: courses });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
