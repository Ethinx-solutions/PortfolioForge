// PM2 ecosystem — local/Windows process persistence.
// Runs the full stack (API server + BullMQ worker) via `npm start`.
// Start:  pm2 start ecosystem.config.js --env production
// Logs:   pm2 logs content-machine
module.exports = {
  apps: [
    {
      name: "content-machine",
      script: "npm",
      args: "start",
      cwd: __dirname,
      watch: false,
      autorestart: true,
      restart_delay: 3000,
      max_restarts: 20,
      kill_timeout: 15000,
      time: true,
      interpreter: "none",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};