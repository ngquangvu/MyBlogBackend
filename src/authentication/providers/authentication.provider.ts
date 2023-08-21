import * as bcrypt from 'bcrypt'
export class AuthenticationProvider {
    static async generatePassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10)
    }

    static async comparePassword(password: string, hashPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashPassword)
    }
}
