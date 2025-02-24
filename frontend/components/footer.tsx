"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="p-4 flex justify-center items-center h-16 border-t">
      <p>&copy; {new Date().getFullYear()} NFT Ticketing dApp</p>
    </footer>
  );
};

export default Footer;
