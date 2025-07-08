import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export function FeatureSection({
  title,
  description,
  image,
  reverse = false,
}: {
  title: string;
  description: string[];
  image: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <motion.section
      className="flex h-screen w-screen snap-start items-center justify-center px-6 md:px-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-10 md:flex-row",
          reverse && "md:flex-row-reverse",
        )}
      >
        {/* 文字部分 */}
        <motion.div
          className="flex-1 space-y-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.3,
              },
            },
          }}
        >
          <motion.h2
            className="text-2xl font-bold md:text-4xl"
            variants={fadeUpVariants}
          >
            {title}
          </motion.h2>
          {description.map((line, idx) => (
            <motion.p
              key={idx}
              className="text-muted-foreground text-base md:text-lg"
              variants={fadeUpVariants}
            >
              {line}
            </motion.p>
          ))}
        </motion.div>

        {/* 图像部分 */}
        <div className="flex-3">{image}</div>
      </div>
    </motion.section>
  );
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
