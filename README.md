<h1 align="center">🔐 JWT Session</h1>
<h2 align="center">A simple proof-of-concept using JSON Web Tokens</h2>

<p><strong>JWT Session</strong> is a small proof-of-concept showing how to configure a session system using <code>jsonwebtoken</code>, following a flow with <strong>Access Token</strong> and <strong>Refresh Token</strong>.</p>

<h2>🧰 Tech Stack</h2>

<h3>Frontend (Client - React)</h3>
<ul>
  <li>React</li>
  <li>Axios</li>
  <li>React Router DOM</li>
</ul>

<h3>Backend (Server - Node.js / Express)</h3>
<ul>
  <li>Express</li>
  <li>CORS</li>
  <li>Cookie-Parser</li>
  <li>Bcrypt</li>
  <li>Dotenv</li>
  <li>MySQL2</li>
</ul>

<h2>⚙️ Configuration</h2>

<h3>📁 <code>.env</code> Files</h3>
<p><strong>On the client:</strong></p>

<pre>
VITE_SERVER_URL=http://localhost:4000
</pre>

<p><strong>On the server:</strong></p>

<pre>
PORT=4000
CLIENT_URL=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_secret_key
REFRESH_TOKEN_SECRET=your_refresh_secret_key
</pre>

<h2>📦 System Overview</h2>

<p>The client does not use Axios directly for protected requests. Instead, it uses a custom Axios instance called <code>api</code>, configured as middleware to verify whether the user is authenticated before making any protected request.</p>

<p>The server uses a middleware on protected routes to verify that the user is logged in before granting access.</p>

<h2>🪜 How It Works</h2>

<ol>
  <li>The user registers via <code>/sign</code>, sending a request to <code>/auth/register</code>.</li>
  <li>The user logs in via <code>/sign</code>, which sends a request to <code>/auth/login</code>.</li>
  <li>The server generates an <strong>accessToken</strong> and sends it back:
    <pre>res.status(200).json({ ok: true, accessToken })</pre>
  </li>
  <li>It also generates a <strong>refreshToken</strong>, sent via HTTP-only cookie:
    <pre>
res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 24 * 7
});
    </pre>
  </li>
  <li>The client receives the <strong>accessToken</strong> and stores it using a custom service object with:
    <ul>
      <li><code>getAccessToken</code></li>
      <li><code>setAccessToken</code></li>
      <li><code>removeAccessToken</code></li>
    </ul>
  </li>
  <li>Protected requests use the access token through this service and the <code>api</code> instance.</li>
  <li>When a protected request is made:
    <ul>
      <li>The server middleware checks if the <code>accessToken</code> is valid.</li>
      <li>If not valid, it checks the <code>refreshToken</code>.</li>
      <li>If both are invalid → <code>401 Unauthorized</code>.</li>
      <li>If the <code>refreshToken</code> is valid → new tokens are generated and sent back to the client the same way as on login.</li>
      <li>If the <code>accessToken</code> is valid → the request is processed normally.</li>
    </ul>
  </li>
</ol>

<h2>👨‍💻 Author</h2>
<p>Project built by <strong>Woodley TK</strong></p>
