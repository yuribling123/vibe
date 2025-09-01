import { useTRPC } from "@/trpc/client";
import Image from "next/image";



const Home =  async () => {
  const trpc = useTRPC();
  trpc.hello .queryOptions({text:"hello"})
  
  return (
    <div>
      hello world 
    </div>  
  ); 
}
// aync because it waits for the database query to finish

export default Home;
