import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User, { IUser } from '@models/userModel';

// JWT options
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret',
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
                return done(null, user);
            } catch (err) {
                return done(err, false);
            }
        },
    ),
);

export default passport;
