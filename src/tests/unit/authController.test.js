const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const authController = require("../../controllers/authController");
const nodemailer = require("nodemailer");

// Mock the config module
jest.mock("../../config", () => ({
  jwtSecret: "test_secret",
}));

jest.mock("../../models/userModel");
jest.mock("jsonwebtoken");
jest.mock("nodemailer");

describe("Auth Controller", () => {
  let req, res, mockUser, mockTransporter;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockUser = {
      save: jest.fn(),
      comparePassword: jest.fn(),
    };
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue(true),
    };
    nodemailer.createTransport.mockReturnValue(mockTransporter);
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user and send OTP email", async () => {
      req.body = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      // Ensure `findOne` resolves to null (no existing user)
      User.findOne.mockResolvedValue(null);

      // Ensure the user is saved
      mockUser.save.mockResolvedValue(mockUser);

      await authController.register(req, res);

      // Assert that `findOne` was called
      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ email: "test@example.com" }, { username: "testuser" }],
      });

      // Assert that `sendMail` was called with correct parameters
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "test@example.com",
          subject: "Email Verification OTP",
          html: expect.stringContaining("Verify Your Email"),
        })
      );
    });
  });

  describe("verifyOTP", () => {
    let req, res, mockUser;

    beforeEach(() => {
      req = { body: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockUser = {
        email: "test@example.com",
        otp: "123456",
        otpExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        isVerified: false,
        save: jest.fn().mockResolvedValue(true),
      };

      User.findOne = jest.fn();
      mockTransporter.sendMail = jest.fn();
    });

    it("should verify OTP and mark user as verified", async () => {
      User.findOne.mockResolvedValue(mockUser);

      req.body = { email: "test@example.com", otp: "123456" };

      await authController.verifyOTP(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(mockUser.isVerified).toBe(true);
      expect(mockUser.otp).toBeUndefined();
      expect(mockUser.otpExpires).toBeUndefined();
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "test@example.com",
          subject: "Welcome to Our Platform",
          html: expect.stringContaining("Welcome to Our Platform!"),
        })
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Email verified successfully",
      });
    });

    it("should return error for invalid OTP", async () => {
      req.body = { email: "test@example.com", otp: "654321" };

      User.findOne.mockResolvedValue(mockUser);

      await authController.verifyOTP(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or expired OTP",
      });
    });
  });

  describe("login", () => {
    it("should log in user and return token", async () => {
      req.body = {
        emailOrUsername: "testuser",
        password: "password123",
      };

      mockUser = {
        ...mockUser,
        _id: "user123",
        username: "testuser",
        email: "test@example.com",
        role: "user",
        isVerified: true,
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue("mockedToken");

      await authController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ email: "testuser" }, { username: "testuser" }],
      });
      expect(mockUser.comparePassword).toHaveBeenCalledWith("password123");
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: "user123", role: "user" },
        expect.any(String),
        { expiresIn: "1h" }
      );
      expect(res.json).toHaveBeenCalledWith({
        token: "mockedToken",
        username: "testuser",
        role: "user",
        email: "test@example.com",
      });
    });

    it("should return error for invalid credentials", async () => {
      req.body = {
        emailOrUsername: "testuser",
        password: "wrongpassword",
      };

      mockUser = {
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      User.findOne.mockResolvedValue(mockUser);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });

    it("should return error for unverified user", async () => {
      req.body = {
        emailOrUsername: "testuser",
        password: "password123",
      };

      mockUser = {
        ...mockUser,
        isVerified: false,
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      User.findOne.mockResolvedValue(mockUser);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Please verify your email before logging in",
      });
    });
  });
});
