import UserModel from "../models/User";
import { getRepository } from "typeorm";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import authConfig from "../config/auth";

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: UserModel;
    token: string;
}
class AuthenticateUserService {
    public async execute({ email, password }: Request): Promise<Response> {
        const userRepository = getRepository(UserModel);

        const user = await userRepository.findOne({
            where: { email },
        });

        if (!user) {
            throw Error("email/password is invalid!");
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw Error("email/password is invalid!");
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return { user, token };
    }
}

export default AuthenticateUserService;
