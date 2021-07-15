const { readVarInt, writeVarInt } = require("../src/datatypes");

describe("Datatypes tests", () => {
  test("Test VarInt decoding", () => {
    const mockBuffer = Buffer.from([0xff, 0xff, 0x7f, 0xff, 0xaa, 0x42]);
    const mockResultBuffer = Buffer.from([0xff, 0xaa, 0x42]);
    const [result, remain] = readVarInt(mockBuffer);

    expect(result).toBe(2097151);
    expect(remain).toEqual(mockResultBuffer);
  });

  test("Test VarInt encoding", () => {
    const encoded = writeVarInt(2097151);
    const mockResultBuffer = Buffer.from([0xff, 0xff, 0x7f])

    expect(encoded).toEqual(mockResultBuffer);
  });
});
