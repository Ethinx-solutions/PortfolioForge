// PM2 ecosystem — single source of truth for both apps.
// env_file points at the production .env so every app loads the same config.
module.exports = [
  {
    name: "ethinx-content",
    cwd: __dirname,
    script: "./api/server.js",
    env_file: __dirname + "/.env",
    env: { NODE_ENV: "production" },
    node_args: "--max-old-space-size=512",
    max_memory_restart: "600M",
    restart_delay: 3000,
    max_restarts: 10,
    time: true,
    kill_timeout: 10000,
  },
  {
    name: "ethinx-content-worker",
    cwd: __dirname,
    script: "./queue/worker.js",
    env_file: __dirname + "/.env",
    env: { NODE_ENV: "production" },
    node_args: "--max-old-space-size=512",
    max_memory_restart: "600M",
    restart_delay: 3000,
    max_restarts: 10,
    time: true,
    kill_timeout: 10000,
  },
];