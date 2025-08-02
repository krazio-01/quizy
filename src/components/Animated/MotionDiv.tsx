"use client";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

type Props = HTMLMotionProps<"div">;

const MotionDiv = React.forwardRef<HTMLDivElement, Props>((props, ref) => (
    <motion.div ref={ref} {...props}>{props.children}</motion.div>
));

export default MotionDiv;
