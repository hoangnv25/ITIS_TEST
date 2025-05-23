"use client";

import React from 'react';
import {motion} from "framer-motion";
import { useInView } from 'react-intersection-observer';
import { slideInFromBottom, slideInFromLeft } from '@/ulti/motion';
import { benefittext } from "../src";
import ClipPath from "@/public/ClipPath";

const BenefitContent = () => {

    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.15,
      });
    
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.3,
          },
        },
      };


  return (
    <>
    <motion.div  
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants} 
      className="flex flex-col items-center justify-center gap-4 w-full py-6 z-[30]">
        <motion.h5 variants={slideInFromBottom} className='font-medium text-xs lg:text-3xl text-[#4e78ce] text-center  px-10 lg:px-20'>
          Bạn sẽ nhận được gì khi trở thành
        </motion.h5>
        <motion.h1 variants={slideInFromBottom} className='font-extrabold text-center text-4xl lg:text-6xl text-[#4e78ce] px-10 lg:px-20'>
          ITIS-ER
        </motion.h1>

        <div className='flex flex-wrap items-center justify-center  px-10 lg:px-20 gap-4 mt-4'>
          {benefittext.map((item)=>(
            <motion.div
            variants={slideInFromLeft(0.6 + 0.1*parseInt(item.id))}
            className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem]"
            key={item.id}
            style={{
              backgroundImage: `url("/card-1.svg")`,
            }}
          >
            <div className="relative z-2 flex flex-col  min-h-[22rem] p-[2.4rem] pointer-events-none">
                  <p className="body-2 mb-6 text-xl font-semibold text-neutral-700 ">{item.text}</p>
            </div>
            <div
                  className="absolute inset-0.5 bg-n-8 -z-10 "
                  style={{ clipPath: "url(#benefits)" }}
                >
                  <div className='absolute z-20 bg-white h-full w-full bottom-0 flex items-center'>
                    <img src={item.src} width={900} height={900} alt="" className='opacity-10'/>
                    </div>
                  <div className="absolute inset-0">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        width={900}
                        height={900}
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                  </div>
                  </div>
                  <div className='h-full w-full absolute top-8 -z-30 left-1/3 -translate-x-12'>
                      <img src="/gradient.png" width={1000} alt="" className=''/>
                  </div>
            
            <ClipPath></ClipPath>
            
          </motion.div>
          ))}
        </div>

    </motion.div>
        
    </>
  )
}

export default BenefitContent
