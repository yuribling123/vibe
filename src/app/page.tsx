"use client"
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/server";
import Image from "next/image";



const Home = () => {
  // const trpc = useTRPC();
  // trpc.hello .queryOptions({text:"hello"})
  const queryClient = getQueryClient
  
  
  return (
    <div>
      hello world 
    </div>  
  ); 
}
// aync because it waits for the database query to finish

export default Home;
