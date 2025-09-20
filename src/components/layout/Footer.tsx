import { APP_CONFIG } from "@/constants";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-6 sm:py-8 mt-12 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-base sm:text-lg font-medium">
            &copy; {APP_CONFIG.author}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;