import { getRepository } from "typeorm";
import UserModel from "../models/User";
import { hash } from "bcryptjs";

interface Request {
    name: string;
    email: string;
    password: string;
}

export default class CreateUserService {
    public async execute({
        name,
        email,
        password,
    }: Request): Promise<UserModel> {
        const userRepository = getRepository(UserModel);

        const checkUserExist = await userRepository.findOne({
            where: { email },
        });

        if (checkUserExist) {
            throw new Error("The email already used");
        }

        const hashedPassword = await hash(password, 8);

        const user = userRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        await userRepository.save(user);

        return user;
    }
}
