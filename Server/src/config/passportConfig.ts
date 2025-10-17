import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
// @ts-ignore
import { Strategy as GitHubStrategy } from "passport-github2";
// @ts-ignore
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import User from "@/models/User/user.model";
import { IUser } from "@/types";
import { generateTokens } from "@/services/jwt.service";
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
        console.log("GitHub profile data:", JSON.stringify(profile, null, 2));
        console.log("GitHub profile emails:", profile.emails);

        let user = await User.findOne({ githubId: profile.id });

        // Try to get email from profile, fallback to API call if needed
        let userEmail = profile.emails?.[0]?.value || null;

        // If email is not in profile, make an API call to get user's primary email
        if (!userEmail) {
          try {
            console.log(
              "Email not found in profile, making API call to GitHub..."
            );
            const emailResponse = await fetch(
              "https://api.github.com/user/emails",
              {
                headers: {
                  Authorization: `token ${accessToken}`,
                  Accept: "application/vnd.github.v3+json",
                  "User-Agent": "Authify-App",
                },
              }
            );

            if (emailResponse.ok) {
              const emails = await emailResponse.json();
              console.log("GitHub emails from API:", emails);
              // Find primary email or first verified email
              const primaryEmail = emails.find(
                (email: any) => email.primary && email.verified
              );
              const firstVerifiedEmail = emails.find(
                (email: any) => email.verified
              );
              userEmail =
                primaryEmail?.email || firstVerifiedEmail?.email || null;
              console.log("Selected email:", userEmail);
            }
          } catch (emailError) {
            console.error("Error fetching GitHub emails:", emailError);
          }
        }

        if (!user) {
          user = await User.create({
            githubId: profile.id,
            name: profile.displayName || profile.username,
            email: userEmail,
            avatar: profile.photos?.[0]?.value || null,
            provider: "github",
            is_active: true,
          });
          console.log("Created new user with email:", userEmail);
        } else {
          // Update existing user's email if we found one and they don't have one
          if (userEmail && !user.email) {
            user.email = userEmail;
            await user.save();
            console.log("Updated existing user with email:", userEmail);
          }
        }

        // Generate JWT tokens for our application
        const payload = {
          name: user.name,
          email: user.email,
          phone: user.phone,
          _id: user._id.toString(),
          role: user.role,
        };

        const { accessToken: jwtAccessToken, refreshToken: jwtRefreshToken } =
          generateTokens(payload);

        return done(null, {
          user,
          accessToken: jwtAccessToken,
          refreshToken: jwtRefreshToken,
          githubAccessToken: accessToken, // Store GitHub OAuth token for revocation
        });
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

        // Generate JWT tokens for our application
        const payload = {
          name: user.name,
          email: user.email,
          phone: user.phone,
          _id: user._id.toString(),
          role: user.role,
        };

        const { accessToken: jwtAccessToken, refreshToken: jwtRefreshToken } =
          generateTokens(payload);

        return done(null, {
          user,
          accessToken: jwtAccessToken,
          refreshToken: jwtRefreshToken,
        });
      } catch (err) {
        return done(err, null);
      }
    }) as GoogleVerifyCallback
  )
);

passport.serializeUser((user: any, done) => {
  // Handle the case where user is wrapped in an object with accessToken and refreshToken
  const actualUser = user.user || user;
  console.log("Serializing user:", actualUser._id);
  done(null, actualUser._id);
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
