/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
         {
           source: "/(E|e)(u|U)(r|R)(n|N)",
           destination: "/Eurn",
         },
         {
          source: "/(R|r)(o|O)(s|S)(e|E)(l|L)(i|I)(n|N)(e|E)",
          destination: "/Roseline",
        },
      ];
    },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        
        headers: [
          { key: 'Content-Type', value: 'application/json'},
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
}

module.exports = nextConfig
