// For demonstration purposes, using an in-memory array as the database
const messages =
  "Health Check -- SUCCESS -200 -- Checking the Health of this APplication";

export const fetchAllMessages = async () => {
  // In a real application, this would fetch data from a database
  return messages;
};
