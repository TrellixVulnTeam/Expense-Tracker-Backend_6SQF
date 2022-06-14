import db from "../db/database.js";
import bcrypt from "bcrypt";
import UUID from "uuid-int";
import jsonwebtoken from "jsonwebtoken";

const userController = {
  signUp: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const existingEmail = await db.get(
        `SELECT email FROM users WHERE email = "${email}"`
      );

      if (existingEmail) {
        return res
          .status(409)
          .json({ message: "This E-mail is already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const generator = UUID(230, 10);
      const id = generator.uuid();

      const ress = await db.run(
        "INSERT INTO Users (id, username, email, password) VALUES (?, ?, ?, ?)",
        [id, username, email, hashedPassword]
      );

      if (ress.changes == 1) {
        console.log("RESS", ress);
        return res
          .status(201)
          .json({ id: id, message: "Signed up successfully" });
      }
    } catch (err) {
      console.error("Error in signUp controller", err);
    }
  },
  signIn: async (req, res) => {
    const { email, password } = req.body;

    const user = await db.get("SELECT * FROM Users WHERE email = ?", email);

    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    console.log("USER", user);

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    const token = jsonwebtoken.sign(
      { email: email, user_id: user.id },
      "aSecretKey",
      { expiresIn: "1h" }
    );

    return res
      .status(200)
      .json({ jwt_token: token, message: "Signed in successfully" });
  },
};

export default userController;
