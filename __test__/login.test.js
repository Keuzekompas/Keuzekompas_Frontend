const { loginAPI } = require("../lib/login");

// Mock apiFetch
jest.mock("../utils/apiFetch", () => ({
  apiFetch: jest.fn(),
}));

const { apiFetch } = require("../utils/apiFetch");

// Mock localStorage
Object.defineProperty(window, "localStorage", {
  value: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
  },
  writable: true,
});

describe("loginAPI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should login successfully and store token", async () => {
    const mockResponse = {
      data: {
        token: "fake-token",
        user: { id: "123" },
      },
    };
    apiFetch.mockResolvedValue(mockResponse);

    const result = await loginAPI("test@student.avans.nl", "password");

    expect(apiFetch).toHaveBeenCalledWith("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@student.avans.nl",
        password: "password",
      }),
      skipAuth: true,
    });
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "fake-token");
    expect(result).toEqual(mockResponse.data);
  });

  it("should throw error if no token in response", async () => {
    const mockResponse = {
      data: {
        user: { id: "123" },
        // no token
      },
    };
    apiFetch.mockResolvedValue(mockResponse);

    await expect(loginAPI("test@student.avans.nl", "password")).rejects.toThrow(
      "Something went wrong. Please try again later. (No token received.)"
    );
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it("should propagate apiFetch errors", async () => {
    const error = new Error("Network error");
    apiFetch.mockRejectedValue(error);

    await expect(loginAPI("test@student.avans.nl", "password")).rejects.toThrow(
      "Network error"
    );
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});
