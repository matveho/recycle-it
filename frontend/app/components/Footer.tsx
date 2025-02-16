import { FaGithub} from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-theme3 py-6">
            <div className="container mx-auto px-6 text-center text-white">
                {/* Links Section */}
                <div className="flex justify-center space-x-6 mb-4">
                    <a
                        href="https://github.com/matveho/recycle-it"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-purple-700 transition duration-300"
                        aria-label="GitHub"
                    >
                        <FaGithub size={28} />
                    </a>
                </div>

                {/* Text Section */}
                <p className="text-sm text-white">
                    &copy; {new Date().getFullYear()} Recycle-it.
                    All rights reserved :)
                </p>
            </div>
        </footer>
    );
}
