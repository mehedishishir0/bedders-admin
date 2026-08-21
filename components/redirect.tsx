"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

const Redirect = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/dashboard");
        }, 500);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-6 rounded-2xl p-8 bg-white shadow-lg">
                {/* Logo */}
                <div className="mx-auto mb-4">
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={900}
                        height={900}
                        className="h-14 w-auto"
                    />
                </div>

                {/* Loader */}
                <Loader2 className="h-10 w-10 animate-spin text-yellow-500" />

                {/* Text */}
                <p className="text-lg font-medium text-gray-700 text-center">
                    Redirecting to your dashboard...
                </p>
            </div>
        </div>
    );
};

export default Redirect;
