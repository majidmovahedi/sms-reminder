import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User, { IUser } from '@models/userModel';

// JWT options
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
};

// JWT Strategy
passport.use(
    new JwtStrategy(
        jwtOptions,
        async (
            jwtPayload: any,
            done: (err: any, user?: IUser | false) => void,
        ) => {
            try {
                const user = await User.findById(jwtPayload.id).exec();
                if (!user) {
                    return done(null, false);
                }
                // console.log('JWT Secret:', jwtOptions.secretOrKey);
                return done(null, user);
            } catch (err) {
                return done(err, false);
            }
        },
    ),
);

export default passport;
