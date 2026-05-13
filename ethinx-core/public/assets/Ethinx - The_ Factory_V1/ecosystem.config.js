module.exports = {
  apps: [
    {
      name: "empire-os-relay",
      script: "empire-os-relay.js",
      cwd: "/var/www/empire-os-relay",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "150M",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
      error_file: "/var/log/empire-os-relay-error.log",
      out_file: "/var/log/empire-os-relay-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};
