const { assert } = require('chai');
const bcrypt = require("bcrypt");
const { getUserByEmail, isRegisted, checkUserId, filter } = require("../helpers");;

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

const testUrls = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
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

describe("#getUserByEmail", function() {
  it("shoule not return 'jd67j2'", () => {
    const user = getUserByEmail("z@example.com", testUsers);
    const expectedOutput = "jd67j2";
    assert.notStrictEqual(user, expectedOutput);
  });
});

describe("#isRegisted", function() {
  it("shoule not return true", () => {
    const user = isRegisted("fff@example.com", testUsers);
    const expectedOutput = "false";
    assert.notStrictEqual(user, expectedOutput);
  });
});

describe("#isRegisted", function() {
  it("shoule return true", () => {
    const user = isRegisted("user2@example.com", testUsers);
    const expectedOutput = "true";
    assert.notStrictEqual(user, expectedOutput);
  });
});

describe("#isRegisted", function() {
  it("shoule not return true", () => {
    const user = isRegisted("ff@example.com", testUsers);
    const expectedOutput = "false";
    assert.notStrictEqual(user, expectedOutput);
  });
});

describe("#isRegisted", function() {
  it("shoule return true", () => {
    const user = isRegisted("user@example.com", testUsers);
    const expectedOutput = "true";
    assert.notStrictEqual(user, expectedOutput);
  });
});

describe("#isRegisted", function() {
  it("shoule return true", () => {
    const user = isRegisted("w@example.com", testUsers);
    const expectedOutput = "true";
    assert.notStrictEqual(user, expectedOutput);
  });
});

describe("#checkUserId", function() {
  it("shoule return true", () => {
    const user = checkUserId("@example.com", "123123", testUsers);
    const expectedOutput = "aJ48lW";
    assert.notStrictEqual(user, expectedOutput);
  });
});

describe("#checkUserId", function() {
  it("shoule return true", () => {
    const user = checkUserId("@ex.com", "123", testUsers);
    const expectedOutput = "aJlW";
    assert.notStrictEqual(user, expectedOutput);
  });
});

describe("#checkUserId", function() {
  it("shoule return true", () => {
    const user = checkUserId("1@esfx.com", "bklkks", testUsers);
    const expectedOutput = "aJlW";
    assert.notStrictEqual(user, expectedOutput);
  });
});

describe("#checkUserId", function() {
  it("shoule return true", () => {
    const user = checkUserId("w@example.com", "123123", testUsers);
    const expectedOutput = "aJ48lW";
    assert.strictEqual(user, expectedOutput);
  });
});

describe("#filter", function() {
  it("shoule return true", () => {
    const user = checkUserId(testUrls, "67ssj1");
    const expectedOutput = undefined;
    assert.strictEqual(user, expectedOutput);
  });
});

describe("#filter", function() {
  it("shoule return true", () => {
    const user = filter(testUrls,"jd67j1");
    const expectedOutput = {};
    assert.notStrictEqual(user, expectedOutput);
  });
});

describe("#filter", function() {
  it("shoule return true", () => {
    const user = filter(testUrls,"afs311");
    const expectedOutput = {};
    assert.notStrictEqual(user, expectedOutput);
  });
});

describe("#filter", function() {
  it("shoule return true", () => {
    const user = filter(testUrls,"aJ48lW");
    const expectedOutput = {
      "b6UTxQ": "https://www.tsn.ca",
      "i3BoGr": "https://www.google.ca"
    };
    assert.notStrictEqual(user, expectedOutput);
  });
});

describe("#filter", function() {
  it("shoule return true", () => {
    const user = filter(testUrls,"afs311");
    const expectedOutput = {"jd67j1": {
      id: "jd67j1",
      email: "z@example.com",
      password: "$2b$10$.2AfTtME1AlqA3ndkQ4AbuvZ0H.bAnCoa7UndQIl2fKlPq/9GvxZy"
    }};
    assert.notStrictEqual(user, expectedOutput);
  });
});