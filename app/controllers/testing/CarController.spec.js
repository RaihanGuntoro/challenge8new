const CarController = require("../CarController");
const { Car } = require("../../models");


describe("CarController", () => {
    describe("#getCarFromRequest", () => {
        it("should testing a #getCarFromRequest function", async () => {
            const name = "Mazda";
            const prompt = "Rx-8";

            const mockRequest = {
                params : {
                    id: 1
                }
            }

            const mockCar = new Car({name, prompt})
            const mockCarModel = {}
            mockCarModel.findByPk = jest.fn().mockReturnValue(mockCar)

            const carcontroller = new CarController({carModel: mockCarModel})
            const result = await carcontroller.getCarFromRequest(mockRequest);

            expect(result).toStrictEqual(mockCar)
        }) 
    });

    describe("#handleDeleteCar", () => {
        it("should testing a #handleDeleteCar function", async () => {

            const name = "Mazda";
            const prompt = "Rx-8";

            const mockRequest = {
                params: {
                    id: 1
                }
            }

            const mockCar = new Car({name, prompt})
            const mockCarModel = {}
            mockCarModel.destroy = jest.fn().mockReturnValue(mockCar)

            const mockResponse = {};
            mockResponse.status = jest.fn().mockReturnThis();
            mockResponse.end = jest.fn().mockReturnThis();

            const carcontroller = new CarController({carModel: mockCarModel});
            await carcontroller.handleDeleteCar(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.end).toHaveBeenCalled()
        })
    });

    describe("#handleGetCar", () => {
        it("should return a value", async () => {
            const name = "Mazda";
            const prompt = "Rx-8";

            const mockRequest = {
                params: {
                    id: 1
                }
            };

            const mockCar = new Car({name, prompt})
            const mockCarModel = {}
            mockCarModel.findByPk = jest.fn().mockReturnValue(mockCar)
            const app = new CarController({carModel: mockCarModel});

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            await app.handleGetCar(mockRequest, mockResponse);
            const app1 = await app.getCarFromRequest(mockRequest);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(app1)
        })
    });

    describe("#handleListCars", () => {
        it("should return res.status(200) and a json", async () => {
            
            const name = "Mazda";
            const prompt = "Rx-8";

            const mockRequest = {
                query: {
                    page: 1,
                    pageSize: 10
                }
            }
            const mockCarModel = {}
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            const app = new CarController({carModel: mockCarModel})
            await app.handleListCars(mockRequest, mockResponse);
            const mockCar = new Car({name, prompt});
            const cars = mockCarModel.findAll = jest.fn().mockReturnValue(mockCar)
            const carCount = mockCarModel.count = jest.fn().mockReturnValue({
                where: query.where,
                include: query.include
            })
            const query = app.getListQueryFromRequest(mockRequest)
            const pagination = app.buildPaginationObject(mockRequest, carCount)

            
            

            expect(mockResponse.status).toHaveBeenCalledWith(200);
        })
    });

    describe("#handleUpdateCar", () => {
        it("should return the updated Car list", async () => {
            const mockRequest = {};
            const {name, price, size, image} = mockCarModel.body;

            const mockCarModel = {};
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const app = new CarController({carModel: mockCarModel})

            const car = await app.getCarFromRequest(mockRequest);

            await car.handleUpdateCar({
                name,
                price,
                size,
                image,
                isCurrentlyRented: false
            })

            await app.handleUpdateCar(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json),toHaveBeenCalledWith(car);
        })
    });

    describe("#handleCreateCar", () => {
        it("should return created Car", async () => {
            const payloadCar = { 
                name: "brio", 
                price: 50000, 
                size: "large", 
                image: "https://upload.wikimedia.org/wikipedia/commons/0/07/2020_Honda_Brio_Satya_E_1.2_DD1_%2820211006%29.jpg", 
                isCurrentlyRented: false, 
            }; 
     
            const mockModel = {} 
     
            const mockTest = new Car(payloadCar) 
     
            mockModel.create = jest.fn().mockReturnValue(mockTest) 
     
            const mockResponse = { 
                status: jest.fn().mockReturnThis(), 
                json: jest.fn().mockReturnThis(), 
            }; 
     
     
            const mockRequest = { 
                body: { 
                    payloadCar, 
                } 
            }; 
     
            const app = new CarController({ 
                carModel: mockModel 
            }); 
     
            const hasil = mockModel.create(payloadCar) 
     
            await app.handleCreateCar(mockRequest, mockResponse) 
     
            const result = await app.handleCreateCar(mockRequest, mockResponse) 
     
            expect(mockResponse.status).toHaveBeenCalledWith(201); 
            expect(mockResponse.json).toHaveBeenCalledWith(hasil); 
        });

        it("should return error", async () => {
            const err = new Error("not Found!");
            const payloadCar = { 
                name: "brio", 
                price: 50000, 
                size: "large", 
                image: "https://upload.wikimedia.org/wikipedia/commons/0/07/2020_Honda_Brio_Satya_E_1.2_DD1_%2820211006%29.jpg", 
                isCurrentlyRented: false, 
            }; 
     
            const mockModel = {} 
     
            const mockTest = new Car(payloadCar) 
     
            mockModel.create = jest.fn().mockReturnValue(Promise.reject(err)) 
     
            const mockResponse = { 
                status: jest.fn().mockReturnThis(), 
                json: jest.fn().mockReturnThis(), 
            }; 
     
     
            const mockRequest = { 
                body: { 
                    payloadCar, 
                } 
            }; 
     
            const app = new CarController({ 
                carModel: mockModel 
            }); 
     
            const hasil = mockModel.create(payloadCar) 
     
            await app.handleCreateCar(mockRequest, mockResponse) 
            expect(mockResponse.status).toHaveBeenCalledWith(422); 
            expect(mockResponse.json).toHaveBeenCalledWith({ 
                error: { 
                    name: err.name, 
                    message: err.message, 
                } 
            }); 
        })
    })


})