require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const GITHUB_API = "https://api.github.com";
const USERNAME = process.env.GITHUB_USERNAME;
const TOKEN = process.env.GITHUB_TOKEN;

// GitHub API Headers
const headers = {
  Authorization: `token ${TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

// GET /github → Fetch user details
app.get("/github", async (req, res) => {
  try {
    const { data } = await axios.get(`${GITHUB_API}/users/${USERNAME}`, { headers });
    res.json({
      username: data.login,
      followers: data.followers,
      following: data.following,
      public_repos: data.public_repos,
      profile_url: data.html_url,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /github/{repo-name} → Fetch repo details
app.get("/github/:repo", async (req, res) => {
  try {
    const { repo } = req.params;
    const { data } = await axios.get(`${GITHUB_API}/repos/${USERNAME}/${repo}`, { headers });
    res.json({
      name: data.name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      url: data.html_url,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /github/{repo-name}/issues → Create an issue
app.post("/github/:repo/issues", async (req, res) => {
  try {
    const { repo } = req.params;
    const { title, body } = req.body;

    const { data } = await axios.post(
      `${GITHUB_API}/repos/${USERNAME}/${repo}/issues`,
      { title, body },
      { headers }
    );

    res.json({ issue_url: data.html_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
