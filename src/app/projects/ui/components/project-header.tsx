import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useSuspenseQuery } from "@tanstack/react-query";

// suspense query is suspend the component until the data is ready, then render the component with the data
interface Props {
    projectId: string;
}

const ProjectHeader = ({ projectId }: Props) => {
    return ( 
        <div>
            project header
        </div>
     );
}
 
export default ProjectHeader;