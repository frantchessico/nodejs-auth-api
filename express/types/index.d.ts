declare namespace Express {
	interface Request {
		user: {
        _id?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
	}
}}