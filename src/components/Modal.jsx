import { createPortal } from "react-dom";
import { motion } from "framer-motion";

export default function Modal({ title, children, onClose }) {
  // const hiddenAnimationState = { y: 30, opacity: 0 };

  return createPortal(
    <>
      <div className="backdrop" onClick={onClose} />
      <motion.dialog
        //variants is used to reuse animation states
        variants={{
          hidden: { y: 30, opacity: 0 },
          visible: { y: 0, opacity: 1 },
          exit: { y: 30, opacity: 0 },
        }}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.2 }}
        open
        className="modal"
      >
        <h2>{title}</h2>
        {children}
      </motion.dialog>
    </>,
    document.getElementById("modal")
  );
}
