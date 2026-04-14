import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function SummaryCard({ label, value, helper, action, tone = "primary" }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      className={`panel summary-card neumorphic-glass tone-${tone}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }}
      whileHover={{ y: -8, scale: 1.02, boxShadow: "0 25px 45px -10px rgba(56,189,248,0.2), inset 0 1px 1px rgba(255,255,255,0.2)", transition: { duration: 0.2 } }}
    >
      <div className="summary-label eyebrow" style={{ transform: "translateZ(15px)" }}>{label}</div>
      <motion.h3 
        style={{ transform: "translateZ(30px)", display: "inline-block" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {value}
      </motion.h3>
      {helper ? <div className="summary-helper muted-text" style={{ transform: "translateZ(10px)" }}>{helper}</div> : null}
      {action ? <div className="summary-card-action" style={{ transform: "translateZ(20px)", marginTop: "1rem" }}>{action}</div> : null}
    </motion.div>
  );
}

export default SummaryCard;
