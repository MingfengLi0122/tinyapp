const { assert } = require('chai');
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

describe("#isRegisted", function() {
  it("shoule not return true", () => {
    const user = isRegisted("fff@example.com", testUsers);
    const expectedOutput = "false";
    assert.notStrictEqual(user, expectedOutput);
  });

  it("shoule not return true", () => {
    const user = isRegisted("user2@example.com", testUsers);
    const expectedOutput = "true";
    assert.notStrictEqual(user, expectedOutput);
  });

  it("shoule return false", () => {
    const user = isRegisted("ff@example.com", testUsers);
    const expectedOutput = false;
    assert.strictEqual(user, expectedOutput);
  });

  it("shoule not return true", () => {
    const user = isRegisted("user@example.com", testUsers);
    const expectedOutput = "true";
    assert.notStrictEqual(user, expectedOutput);
  });

  it("shoule not return true", () => {
    const user = isRegisted("w@example.com", testUsers);
    const expectedOutput = "true";
    assert.notStrictEqual(user, expectedOutput);
  });
});

describe("#checkUserId", function() {
  it("shoule not return 'aJ48lW'", () => {
    const user = checkUserId("@example.com", "123123", testUsers);
    const expectedOutput = "aJ48lW";
    assert.notStrictEqual(user, expectedOutput);
  });

  it("shoule not return 'aJlW", () => {
    const user = checkUserId("@ex.com", "123", testUsers);
    const expectedOutput = "aJlW";
    assert.notStrictEqual(user, expectedOutput);
  });

  it("shoule not return 'sfsf'", () => {
    const user = checkUserId("1@esfx.com", "bklkks", testUsers);
    const expectedOutput = "sfsf";
    assert.notStrictEqual(user, expectedOutput);
  });

  it("shoule return 'aJ48lW'", () => {
    const user = checkUserId("w@example.com", "123123", testUsers);
    const expectedOutput = "aJ48lW";
    assert.strictEqual(user, expectedOutput);
  });
});

describe("#filter", function() {
  it("shoule return undefined", () => {
    const user = checkUserId(testUrls, "67ssj1");
    const expectedOutput = undefined;
    assert.strictEqual(user, expectedOutput);
  });

  it("shoule not return {s: 400}", () => {
    const user = filter(testUrls,"jd67j1");
    const expectedOutput = {s: 400};
    assert.notStrictEqual(user, expectedOutput);
  });

  it("shoule not return {}", () => {
    const user = filter(testUrls,"afs311");
    const expectedOutput = {};
    assert.notStrictEqual(user, expectedOutput);
  });

  it("shoule return the expectedOutput", () => {
    const user = filter(testUrls,"aJ48lW");
    console.log(user);
    const expectedOutput = { 
      b6UTxQ: 'https://www.tsn.ca', 
      i3BoGr: 'https://www.google.ca' 
    }
    assert.deepEqual(user, expectedOutput);
  });

  it("shoule not return the expectedOutput", () => {
    const user = filter(testUrls,"afs311");
    const expectedOutput = {"jd67j1": {
      id: "jd67j1",
      email: "z@example.com",
      password: "$2b$10$.2AfTtME1AlqA3ndkQ4AbuvZ0H.bAnCoa7UndQIl2fKlPq/9GvxZy"
    }};
    assert.notStrictEqual(user, expectedOutput);
  });
});

