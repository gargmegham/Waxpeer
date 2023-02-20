module.exports = {
  apps: [
    {
      script: "npm start",
    },
  ],

  deploy: {
    production: {
      user: "ubuntu",
      key: "example.cer",
      host: "34.233.233.255",
      ref: "origin/main",
      repo: "git@github.com:gargmegham/waxpeer-bot.git",
      path: "/home/ubuntu",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && npm run build && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
      ssh_options: "ForwardAgent=yes",
    },
  },
};
