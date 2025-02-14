
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-primary mb-4">Page non trouvée</h2>
          <p className="text-primary/70 mb-8">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
