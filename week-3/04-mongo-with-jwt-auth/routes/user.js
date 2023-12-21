const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { User, JWT_PASSWORD, Course } = require("../db");
const CustomError = require("../error/customError");
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

router.post("/signin", async (req, res, next) => {
  // Implement admin signup logic
  const user = req.body;

  try {
    const userFind = await User.findOne(user);
    console.log(userFind, "FIndig user...");
    const token = jwt.sign({ username: userFind.username }, JWT_PASSWORD);
    res.status(200).send(token);
  } catch (err) {
    console.log(err);
    err = new CustomError("Invalid credentials", 401);
    next(err);
  }
});

router.get("/courses", userMiddleware, async (req, res, next) => {
  // Implement listing all courses logic
  try {
    const courses = await Course.find({});
    res.status(200).send({ courses });
  } catch (err) {
    next(err);
  }
});

router.post("/courses/:courseId", userMiddleware, async (req, res, next) => {
  // Implement course purchase logic
  const id = req.params.courseId;

  try {
    const course = await Course.findOne({ _id: id });

    const user = req.user;
    if (user.purchasedCourses.includes(course._id)) {
      throw new CustomError("Course already purchased", 411);
    }

    console.log();
    user.purchasedCourses.push(course);
    user.save();
  } catch (err) {
    if (!(err instanceof CustomError))
      err = new CustomError("Invalid Course Id / not found", 404);
    next(err);
  }

  res.send({ message: "Course purchased successfully" });
});

router.get("/purchasedCourses", userMiddleware, async (req, res, next) => {
  // Implement fetching purchased courses logic
  try {
    const user = req.user;

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
