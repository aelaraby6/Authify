import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "@/models/User/user.model";
import { IUser } from "@/types";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const user: IUser | null = await User.findOne({
          email: email.toLowerCase(),
          is_deleted: false,
          is_active: true,
        });

        if (!user) {
          return done(null, false, { message: "Incorrect credentials." });
        }

        const isMatch: boolean = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
          return done(null, false, { message: "Incorrect credentials." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  console.log("Serializing user:", user);
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return done(new Error("User not found"));
    }
    console.log("Deserialized user:", user);
    done(null, user);
  } catch (err) {
    done(err);
  }
});