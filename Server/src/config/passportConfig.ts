import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
// @ts-ignore
import { Strategy as GitHubStrategy } from "passport-github2";
// @ts-ignore
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import User from "@/models/User/user.model";
import { IUser } from "@/types";
import dotenv from "dotenv";
dotenv.config();

// Local Strategy
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

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL:
        process.env.GITHUB_CALLBACK_URL ||
        "http://localhost:3000/api/auth/github/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (error: any, user?: any) => void
    ) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          user = await User.create({
            githubId: profile.id,
            name: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value || null,
            avatar: profile.photos?.[0]?.value || null,
            provider: "github",
            is_active: true,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Google
interface GoogleProfile {
  id: string;
  displayName: string;
  emails?: { value: string }[];
  photos?: { value: string }[];
}

interface GoogleVerifyCallback {
  (
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: (error: any, user?: any) => void
  ): Promise<void>;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:3000/api/auth/google/callback",
    },
    (async (
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: (error: any, user?: any) => void
    ): Promise<void> => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || null,
            avatar: profile.photos?.[0]?.value || null,
            provider: "google",
            is_active: true,
          });
        }

        return done(null, { user, accessToken, refreshToken });
      } catch (err) {
        return done(err, null);
      }
    }) as GoogleVerifyCallback
  )
);

passport.serializeUser((user: any, done) => {
  console.log("Serializing user:", user._id);
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

export default passport;
