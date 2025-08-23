import Image from "next/image";
import prisma from "@/lib/db";


const Home =  async () => {
  const users = await prisma.user.findMany();
  return (
    <div>
      {JSON.stringify(users, null, 2)}
    </div>
  );
}
// aync because it waits for the database query to finish

export default Home;
