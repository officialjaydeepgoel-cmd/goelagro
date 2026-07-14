module.exports = {
  apps: [
    {
      name: "backend",
      cwd: "C:/Users/jiten/Documents/Demo Opencode/trade/backend",
      script: "node_modules/tsx/dist/cli.mjs",
      args: "src/index.ts",
      interpreter: "C:/Program Files/nodejs/node.exe",
      env: {
        PATH: "C:\\Program Files\\nodejs;" + process.env.PATH,
      },
    },
    {
      name: "frontend",
      cwd: "C:/Users/jiten/Documents/Demo Opencode/trade",
      script: "node_modules/next/dist/bin/next",
      args: "dev -p 3000 -H 0.0.0.0",
      interpreter: "C:/Program Files/nodejs/node.exe",
      env: {
        PATH: "C:\\Program Files\\nodejs;" + process.env.PATH,
      },
    },
    {
      name: "tunnel",
      script: "C:/Users/jiten/cloudflared.exe",
      args: "tunnel --url http://localhost:3000",
      interpreter: "",
      env: {
        PATH: process.env.PATH,
      },
    },
  ],
};
