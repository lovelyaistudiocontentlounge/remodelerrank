module.exports = {
  apps: [
    {
      name: 'remodelerrank',
      script: 'index.js',
      args: '--schedule',
      cwd: __dirname,
      restart_delay: 5000,
      max_restarts: 10,
      log_file: 'logs/pm2.log',
      error_file: 'logs/pm2-error.log',
      time: true,
    },
    {
      name: 'morning-review',
      script: 'server.js',
      cwd: __dirname,
      restart_delay: 3000,
      max_restarts: 10,
      log_file: 'logs/morning.log',
      error_file: 'logs/morning-error.log',
      time: true,
    },
  ],
};
