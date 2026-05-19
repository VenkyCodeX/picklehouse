import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  const msg = encodeURIComponent('Hi Pickle House! 🫙 I want to place an order. Please share your product list and prices.');
  return (
    <motion.a
      href={`https://wa.me/919262342344?text=${msg}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl wa-pulse"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 3, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
    >
      <svg viewBox="0 0 32 32" width="30" height="30" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.675 4.797 1.849 6.785L2 30l7.43-1.818A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.54 11.54 0 0 1-5.88-1.607l-.422-.25-4.41 1.08 1.115-4.295-.276-.44A11.56 11.56 0 0 1 4.4 16C4.4 9.59 9.59 4.4 16 4.4S27.6 9.59 27.6 16 22.41 27.6 16 27.6zm6.34-8.64c-.347-.174-2.055-1.013-2.374-1.129-.319-.116-.551-.174-.783.174-.232.347-.899 1.129-1.102 1.362-.203.232-.406.26-.753.087-.347-.174-1.464-.54-2.788-1.72-1.03-.918-1.726-2.052-1.929-2.399-.203-.347-.022-.535.153-.708.157-.156.347-.406.521-.609.174-.203.232-.347.347-.579.116-.232.058-.435-.029-.609-.087-.174-.783-1.888-1.073-2.587-.283-.68-.57-.587-.783-.598l-.667-.011c-.232 0-.609.087-.928.435-.319.347-1.218 1.19-1.218 2.903s1.247 3.368 1.421 3.6c.174.232 2.453 3.745 5.944 5.252.831.359 1.48.573 1.986.733.834.265 1.594.228 2.194.138.669-.1 2.055-.84 2.345-1.652.29-.812.29-1.508.203-1.652-.086-.145-.318-.232-.666-.406z"/>
      </svg>
    </motion.a>
  );
}
