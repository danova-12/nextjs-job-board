/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                hostname: "xmdoiwizqydemljy.public.blob.vercel-storage.com",
            }
        ]
    }
}

module.exports = nextConfig
