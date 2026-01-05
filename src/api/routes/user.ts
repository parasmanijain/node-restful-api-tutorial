import { Router } from "express";
import { user_delete, user_login, user_signup } from "../controllers/user.js";
import checkAuth from "../middleware/check-auth.js";

const router = Router();

router.post("/signup", user_signup);

router.post("/login", user_login);

router.delete("/:userId", checkAuth, user_delete);

export default router;
