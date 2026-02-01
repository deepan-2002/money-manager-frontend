import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-6 mt-auto bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-gray-500 text-sm">
                    &copy; {currentYear} <a href="https://github.com/deepan-2002" target="_blank" rel="noopener noreferrer">Deeban Yathiraja</a>. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
