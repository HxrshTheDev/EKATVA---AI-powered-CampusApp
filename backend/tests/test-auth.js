const http = require("http");

const payload = JSON.stringify({
  firstName: "Demo",
  lastName: "User",
  email: "demo@ekatva.campus",
  password: "Demo@12345",
  college: "EKATVA University",
  course: "B.Tech",
  year: 3,
  rollNumber: "EC-DEMO-001",
  role: "student"
});

const opts = {
  hostname: "localhost",
  port: 5000,
  path: "/api/auth/register",
  method: "POST",
  headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) }
};

const req = http.request(opts, res => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    console.log("STATUS:", res.statusCode);
    console.log("BODY:", data);
    // If register succeeded or user already exists, try login
    const loginPayload = JSON.stringify({ email: "demo@ekatva.campus", password: "Demo@12345" });
    const loginOpts = {
      hostname: "localhost", port: 5000, path: "/api/auth/login", method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(loginPayload) }
    };
    const loginReq = http.request(loginOpts, loginRes => {
      let ld = "";
      loginRes.on("data", c => ld += c);
      loginRes.on("end", () => {
        console.log("\nLOGIN STATUS:", loginRes.statusCode);
        console.log("LOGIN BODY:", ld);
      });
    });
    loginReq.write(loginPayload);
    loginReq.end();
  });
});
req.write(payload);
req.end();
