import appError from "../utils/appError.js"
import httpStatusText from "../utils/httpStatusText.js"

export const isAuthorized = (role) => {
    return async (req, res, next) => {
        if (req.user.role !== role) return next(appError.create("not Authorized", 403, httpStatusText.FAIL));

        return next();
    };
};
