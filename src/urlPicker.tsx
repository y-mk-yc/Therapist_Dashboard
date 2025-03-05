// const URL_KEY = 'url'

export const serviceUrls = {
  auth: 'http://localhost:3000',  // URL for the auth service

  chat: 'http://localhost:3002',  // URL for the chat(socket) service
  note: 'http://localhost:3003',  // URL for the note service
  data: 'http://localhost:3004',  // URL for the data service
  // Add more services as needed
};
Object.keys(serviceUrls).forEach((key) =>
{
  const service = key as keyof typeof serviceUrls; // Type assertion to ensure 'key' is a valid service name
  const defaultUrl = serviceUrls[service];
  localStorage.setItem(`${service}-url`, defaultUrl);  // Store the default URL for each service
});
export const getUrl = (service: keyof typeof serviceUrls) =>
{
  // Retrieve the URL for the specific service from localStorage (or fallback to default)
  return localStorage.getItem(`${service}-url`) || serviceUrls[service];
};