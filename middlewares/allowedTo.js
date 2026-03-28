import appError from "../utils/appError.js"
import httpStatusText from "../utils/httpStatusText.js"

export const isAuthorized = (...roles) => {
    return async (req, res, next) => {
        if (!roles.includes(req.user.role)) return next(appError.create("not Authorized", 403, httpStatusText.FAIL));

        return next();
    };
};
