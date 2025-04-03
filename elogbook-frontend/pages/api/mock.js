export default function handler(req, res) {
    res.status(200).json({
     "mockUser": [ 
      {
      "firstName": "Demo",
      "fullName": "Demo User",
      "primaryEmailAddress": { "emailAddress": "demo@example.com" },
      "password": "student"
    }],
    "mockSupervisorUser": [ 
      {
      "firstName": "Supervisor",
      "fullName": "Supervisor User",
      "primaryEmailAddress": { "emailAddress": "supervisor@example.com" },
      "password": "supervisor"
    }],
    "mockAdminUser": [
      {
      "firstName": "Admin",
      "fullName": "Admin User",
      "primaryEmailAddress": { "emailAddress": "admin@example.com" },
      "password": "admin"
    }],
    });
  }
  