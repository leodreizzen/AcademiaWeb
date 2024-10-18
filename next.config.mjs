/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: isTesting() ? '.next.testing' : '.next',
};

export function isTesting(){
    return process.env.TESTING?.toLowerCase() === 'true'
}
export default nextConfig;
