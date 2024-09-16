import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '@models/userModel';

// JWT options
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret',
};

// JWT Strategy
passport.use(
    new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
        try {
            // Find the user based on the payload
            const user = await User.findById(jwtPayload.id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    }),
);

export default passport;
