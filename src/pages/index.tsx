import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-4xl font-bold mb-4">Task Manager API</h1>
            <p className="text-lg mb-8">Secure REST API with JWT Authentication & Role-Based Access</p>
            <div className="flex gap-4">
                <Link href="/register" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                    Register
                </Link>
                <Link href="/login" className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700">
                    Login
                </Link>
                <Link href="/api/docs" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                    API Docs
                </Link>
            </div>
        </div>
    );
}