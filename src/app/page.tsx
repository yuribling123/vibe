import Image from "next/image";
import prisma from "@/lib/db";
export default function Home() {
  const users = prisma.user.findMany();
  // findmany means find all users
  return (
    <div> 
      {JSON.stringify(users,null,2)}
      //
   
    </div>
  );
}
