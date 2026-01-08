const { loginAPI } = require("../lib/login");

// Mock apiFetch
jest.mock("../utils/apiFetch", () => ({
  apiFetch: jest.fn(),
}));

const { apiFetch } = require("../utils/apiFetch");

// Mock localStorage (Node-safe)
Object.defineProperty(globalThis, "localStorage", {
  value: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
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
    apiFetch.mockResolvedValue({
      data: { user: { id: "123" } },
    });

    await expect(loginAPI("test@student.avans.nl", "password")).rejects.toThrow(
      "Something went wrong. Please try again later. (No token received.)"
    );

    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it("should propagate apiFetch errors", async () => {
    apiFetch.mockRejectedValue(new Error("Network error"));

    await expect(loginAPI("test@student.avans.nl", "password")).rejects.toThrow(
      "Network error"
    );

    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});
