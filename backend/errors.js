module.exports = {
    NotFound: {
        code: 404,
        success: false,
        internal: true,
        message: 'Not Found'
    },

    ServerError: {
        code: 500,
        success: false,
        internal: true,
        message: 'A server error has occurred'
    },

    AuthError: {
        code: 401,
        success: false,
        internal: true,
        message: "You are not authorized to access this resource"
    },

    SQLError: {
        code: 500,
        success: false,
        internal: true,
        message: "An internal error occurred"
    },

    EmailExists: {
        code: 402,
        success: false,
        internal: true,
        message: "This email address is already in use"
    },

    ParseError: (err) => {
        if (err.internal) //Return if already in error format
            return err;

        console.log(err);

        if (err.length) { //SQL Error
            return {
                code: 500,
                success: false,
                message: err.detail
            };
        }

        return {
            code: 500,
            success: false,
            message: err.message || 'A server error has occurred'
        }
    }
};