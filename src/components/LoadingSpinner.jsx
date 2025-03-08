import { motion } from "framer-motion";
import vaultSvg from "../assets/images/vault_svg.jpeg"

const LoadingSpinner = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <motion.div 
                className="relative w-24 h-24 flex items-center justify-center"
                animate={{
                    rotate: [0, -15, 15, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: "easeInOut"
                }}
            >
                <img src={vaultSvg} alt="Loading" className="w-8 h-8" />
                <div className="absolute w-14 h-14 border-4 border-indigo-600 border-t-transparent border-b-transparent rounded-full animate-spin"></div>
            </motion.div>
        </div>
    );
};

export default LoadingSpinner;
