'use client';
import TaiKhoanCaNhanMain from '@/components/main/TaiKhoanCaNhan/TKCT_Main'
import TaiKhoanCaNhan from '@/components/main/TaiKhoanCaNhan/TKCN'
import React from 'react'
import './style.css';



export default function TaiKhoanCaNhanPage()
{
  return (
  <main className="w-full kanit-regular bg-white TKCN_container_css">
    
    {/* <TaiKhoanCaNhanMain/> */}
    <TaiKhoanCaNhan/>
  </main>
  );
}