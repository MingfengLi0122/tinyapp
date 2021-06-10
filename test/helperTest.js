const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  },
  "aJ48lW": {
    id: "aJ48lW",
    email: "w@example.com",
    password: "$2b$10$AOVC5x0lFdC5BEK6TSb1vOoo3mUI4TflgM5SKa2FNNqcwVefylccu", //original 123123
  },
  "jd67j1": {
    id: "jd67j1",
    email: "z@example.com",
    password: "$2b$10$.2AfTtME1AlqA3ndkQ4AbuvZ0H.bAnCoa7UndQIl2fKlPq/9GvxZy", //original 123321
  }
};

describe("#getUserByEmail", function() {
  it("should return 'userRandomID'", () => {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.strictEqual(user, expectedOutput);
  });
});

describe("#getUserByEmail", function() {
  it("shoule return 'user2RandomID'", () => {
    const user = getUserByEmail("user2@example.com", testUsers);
    const expectedOutput = "user2RandomID";
    assert.strictEqual(user, expectedOutput);
  });
});

describe("#getUserByEmail", function() {
  it("shoule return 'aJ48lW'", () => {
    const user = getUserByEmail("w@example.com", testUsers);
    const expectedOutput = "aJ48lW";
    assert.strictEqual(user, expectedOutput);
  });
});

describe("#getUserByEmail", function() {
  it("shoule return 'jd67j1'", () => {
    const user = getUserByEmail("z@example.com", testUsers);
    const expectedOutput = "jd67j1";
    assert.strictEqual(user, expectedOutput);
  });
});

describe("#getUserByEmail", function() {
  it("shoule not return 'jd67j2'", () => {
    const user = getUserByEmail("z@example.com", testUsers);
    const expectedOutput = "jd67j2";
    assert.notStrictEqual(user, expectedOutput);
  });
});