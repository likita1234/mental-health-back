const isObjectId = (value) => {
  // ObjectId typically consists of 24 hexadecimal characters
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(value);
};
module.exports = {
  isObjectId,
};
