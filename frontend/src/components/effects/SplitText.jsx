import React from "react";
import { motion } from "framer-motion";

/**
 * Reveals text character-by-character on scroll-in. Words stay together
 * (no mid-word wrap) and spaces are preserved.
 */
const SplitText = ({
  text,
  className = "",
  delay = 0,
  stagger = 0.025,
  as: Tag = "span",
}) => {
  const words = String(text).split(" ");

  return (
    <Tag className={className}>
      {words.map((word, wi) => (
        <span
          key={`${word}-${wi}`}
          className="inline-block whitespace-nowrap"
          style={{ marginRight: "0.25em" }}
        >
          {Array.from(word).map((ch, ci) => (
            <motion.span
              key={`${ch}-${ci}`}
              initial={{ y: "110%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay: delay + (wi * 4 + ci) * stagger,
              }}
              className="inline-block"
            >
              {ch}
            </motion.span>
          ))}
        </span>
      ))}
    </Tag>
  );
};

export default SplitText;
