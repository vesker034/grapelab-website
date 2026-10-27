"use client";

import Image from "next/image";
import React from "react";

export default function Separator() {
    return <div className="flex items-center gap-6 w-[80%] mx-auto my-16">
        <div className="flex-1 h-[2px] bg-navbar"></div>
        <Image
            src="/purple-logo.svg"
            alt="marker"
            width={60}
            height={60}
            className="shrink-0"
        />
        <div className="flex-1 h-[2px] bg-navbar"></div>
    </div>;
}