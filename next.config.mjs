/** @type {import('next').NextConfig} */
const nextConfig = {
  // Garantit que le PDF du guide est inclus dans le bundle serveur (prod / Vercel),
  // car il est lu dynamiquement via fs.readFile dans la Server Action.
  outputFileTracingIncludes: {
    "/": ["./app/assets/pdf/**"],
  },
};

export default nextConfig;
