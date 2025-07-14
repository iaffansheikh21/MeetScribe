import React from 'react';
import Link from 'next/link';
import {
    Instagram,
    Linkedin,
    Facebook,
    Twitter,
    Youtube,
    Phone,
    Mail,
    MapPin,
} from 'lucide-react';

function Footer2() {
    return (
        <footer className="w-full bg-transparent text-black border-neutral-800 py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

                <div className="">
                    <Link href={"/"}>
                    <div className="flex items-center gap-2 mb-4">
                        <img
                            src="/logo.png"
                            alt="MeetScribe Logo"
                            className="h-10 w-auto"
                        />
                    </div></Link>
                    
                    <p className="text-sm text-black">
                        Turn conversations into clarity with smart AI transcription.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4 text-black">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link
                                href="/about"
                                className="text-black hover:text-[hsl(255,75%,63%)] transition"
                            >
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/team"
                                className="text-black hover:text-[hsl(255,75%,63%)] transition"
                            >
                                Team
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/help"
                                className="text-black hover:text-[hsl(255,75%,63%)] transition"
                            >
                                Help Center
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/faqs"
                                className="text-black hover:text-[hsl(255,75%,63%)] transition"
                            >
                                FAQs
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4 text-black">Contact Us</h3>
                    <ul className="space-y-4 text-sm text-black">
                        <li className="flex items-start gap-2">
                            <Mail className="w-4 h-4 mt-1 text-purple-500" />
                            meetscribe0@gmail.com
                        </li>
                        <li className="flex items-start gap-2">
                            <Phone className="w-4 h-4 mt-1 text-purple-500" />
                            +92 310 1048485
                        </li>
                        <li className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-1 text-purple-500" />
                            Office #201, Main Satyana Road ,<br /> Faisalabad, Pakistan
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4 text-black">Follow Us</h3>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:opacity-30 transition duration-200">
                            <Twitter className="text-blue-500" />
                        </Link>
                        <Link href="#" className="hover:opacity-30 transition duration-200">
                            <Linkedin className="text-blue-700" />
                        </Link>
                        <Link href="#" className="hover:opacity-30 transition duration-200">
                            <Facebook className="text-blue-600" />
                        </Link>
                        <Link href="#" className="hover:opacity-30 transition duration-200">
                            <Youtube className="text-red-600" />
                        </Link>
                        <Link href="#" className="hover:opacity-30 transition duration-200">
                            <Instagram className="text-pink-500" />
                        </Link>
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="border-t border-neutral-800 mt-12 pt-6 text-center text-sm text-black">
                &copy; {new Date().getFullYear()} MeetScribe. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer2;
