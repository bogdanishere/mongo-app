# mongo-app

npm run build
cp -r public .next/standalone/; cp -r .next/static .next/standalone/.next/
node .next/standalone/server.js

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
/_ config options here _/
output: "standalone",
};

export default nextConfig;
