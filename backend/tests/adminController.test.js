const {
  registerAdmin,
  loginAdmin,
  getConfirmationCode,
  updateAdminPassword,
} = require("../controllers/adminController");

beforeEach(() => initDatabase());
afterEach(() => closeDatabase());

const initDatabase = () => console.log("Database Initialized...");
const closeDatabase = () => console.log("Database Closed...");

describe("registerAdmin", () => {
  const newAdmin = {
    first_name: "Theophilus",
    last_name: "Gordon",
    email: "theophilus.gordon@amalitech.org",
    phone: "+233558152011",
    company: "Amalitech",
    password: "Password",
  };

  it("should return the newly registered admin if registered", () => {
    expect(registerAdmin).toEqual(newAdmin);
  });
});
