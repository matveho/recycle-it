import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <header className="z-50 bg-white text-white shadow-md">
            <div className="py-3 text-white">
                <div className="container mx-auto px-5 lg:px-10">
                    {/* Centered Navbar Container */}
                    <div className="flex items-center justify-center space-x-3">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3">
                            <Image
                                src="/assets/Icon.png"
                                alt="Recycle-it"
                                height={50}
                                width={50}
                                className="rounded-lg"
                            />
                            {/* Text */}
                            <span className="text-theme1 text-4xl font-light font-montserratAlt1">
                              Recycle It
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
