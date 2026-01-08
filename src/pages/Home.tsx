import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import gshLogo from '@/assets/gsh-logo.png';

export default function Home() {
  return (
    <div className="gradient-bg-animated fixed inset-0 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="glass-card w-full max-w-md rounded-3xl p-8 text-center"
      >
        <motion.img
          src={gshLogo}
          alt="GSH Social"
          className="floating-animation mx-auto mb-6 h-28 w-28 drop-shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        />

        <h1 className="mb-2 text-3xl font-bold">
          Bienvenue sur{' '}
          <span className="gradient-text">GSH Social</span>
        </h1>

        <p className="mb-8 text-muted-foreground">
          Connecte-toi, partage et découvre un univers doux et moderne.
        </p>

        <div className="flex flex-col gap-3">
          <Link to="/login">
            <Button className="btn-gradient w-full py-6 text-lg font-semibold">
              Se connecter
            </Button>
          </Link>
          <Link to="/register">
            <Button
              variant="outline"
              className="w-full border-2 border-primary/30 py-6 text-lg font-semibold hover:bg-primary/10"
            >
              Créer un compte
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
