import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

function WeddingIcons() {
  return (
    <motion.div 
      className="flex gap-3 items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, -5, 5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1
        }}
      >
        <Icon icon="mdi:heart-outline" className="text-4xl text-olive/80" />
      </motion.div>
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
          delay: 0.5
        }}
      >
        <Icon icon="mdi:ring-outline" className="text-4xl text-olive/80" />
      </motion.div>
    </motion.div>
  );
}

export default WeddingIcons;

