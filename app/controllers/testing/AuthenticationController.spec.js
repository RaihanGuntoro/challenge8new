const  AuthenticationController  = require("../AuthenticationController");
const {JWT_SIGNATURE_KEY} = require("../../../config/application")
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { User } = require("../../models")


describe("#AuthenticationController", () => {
    describe("#createTokenFromUser", () => {
        it("it should create new token", async () => {
            const user = {
                id: 1,
                name: "Raihan",
                email: "raihan@gmail.com",
                image: "gambar.jpg",
            }

            const role = {
                    id: 1,
                    name: "ADMIN"
            }

            const mockUser = user;
            const mockRole = role;

            const token = jsonwebtoken.sign({
                id: mockUser.id,
                name: mockUser.name,
                email: mockUser.email,
                image: mockUser.image,
                role: {
                    id: mockRole.id,
                    name: mockRole.name
                }
            }, JWT_SIGNATURE_KEY)

            const app = new AuthenticationController({jwt:jsonwebtoken})
            const result = await app.createTokenFromUser(mockUser, mockRole)
            const hasil = jest.fn();
            hasil.mockReturnValue(result)

            expect(result).toEqual(token)
        })
    });

    describe("#decodeToken", () => {
        it("should decode token", async () => {
            const user = {
                id: 1,
                name: "Raihan",
                email: "raihan@gmail.com",
                image: "gambar.jpg",
            }

            const role = {
                    id: 1,
                    name: "ADMIN"
            }

            const mockUser = user;
            const mockRole = role;

            const token = jsonwebtoken.sign({
                id: mockUser.id,
                name: mockUser.name,
                email: mockUser.email,
                image: mockUser.image,
                role: {
                    id: mockRole.id,
                    name: mockRole.name
                }
            }, JWT_SIGNATURE_KEY)

            const decoded = jsonwebtoken.verify(token, JWT_SIGNATURE_KEY)
            const app = new AuthenticationController({jwt: jsonwebtoken})
            const result = await app.decodeToken(token)

            expect(result).toEqual(decoded)
        })
    });

    describe("#encryptPassword", () => {
        it("should encrypt the password", async () => {
            const password = "123456789";
            const encrypt = bcrypt.hashSync(password, 10);

            const app = new AuthenticationController({jwt:jsonwebtoken, bcrypt:bcrypt})
            const result = await app.encryptPassword(password);

            expect(result.slice(0, -53)).toEqual(encrypt.slice(0, -53));
        })
    });

    describe("#verifyPassword", () => {
        it("should verify password and encrypted one", async () => {
            const password = "123456789";

            const encrypt = bcrypt.hashSync(password, 0);

            const verif = bcrypt.compareSync(password, encrypt)

            const app = new AuthenticationController({jwt:jsonwebtoken, bcrypt:bcrypt})
            const result = await app.verifyPassword(password, encrypt);

            expect(result).toEqual(verif)
        })
    });

    describe("#handleRegister", () => {
        it("should register user", async () => {
            const name = "Raihan";
            const email = "Raihann@gmail.com";
            const password = "123456789"

            const mockRequest = {
                body: {
                    name: name,
                    email: email,
                    password: password
                }
            }

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            } 

            const mockNext = {}

            const mockUser = new User({name, email, password})
            const mockUserModel = {};
            let existingUser = mockUserModel.findOne = jest.fn().mockReturnValue(mockUser)
            const app = new AuthenticationController({userModel: mockUserModel})
            const result = await app.handleRegister(mockRequest, mockResponse, mockNext);
        })
    })
})