module.exports = {
  apps: [
    {
      name: "task-management",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
