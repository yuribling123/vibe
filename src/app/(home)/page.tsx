"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { ProjectForm } from "@/modules/home/ui/project-form";

const Page = () => {  

 

  
  return ( 
    
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:py-48">

        <div className="flex flex-col items-center">
                    <Image src="/logo.svg" alt="Logo" width={50} height={50} className="hidden md:block"/>
        </div>

        <h1 className="text-2xl md:text:5xl font-bold text-center">
          Build something with AI
        </h1>

        <ProjectForm  />


      </section>

    </div>
 

  );
}

export default Page;
