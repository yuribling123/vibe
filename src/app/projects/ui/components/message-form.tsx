import {Form, useForm} from "react-hook-form";
import {useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import {z} from "zod";
import {useMutation,useQuery,useQueryClient} from "@tanstack/react-query";
import {ArrowUpIcon, Loader2Icon} from "lucide-react";
import {Button} from "@/components/ui/button";
interface Props{
    projectId: string;
}
const formScheme = z.object({
    value: z.string()
    .min(1, "Message cannot be empty")
    .max(10000,{message:"Value is too long"}),
})

export const MessageForm = ({projectId}: Props) => {
    const form = useForm<z.infer<typeof formScheme>>({
        resolver: zodResolver(formScheme),
        defaultValues: {
            value: "",
        }
    });
    const onSubmit = (values:z.infer<typeof formScheme>)=>{
        console.log("submit:", values);
    }
     
    const [isLoading, setIsLoading] = useState(false);
    return (
        <Form {...form}> 
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-2 w-full">
            Message from 
        </form>
          Message Form
        </Form>
    );
}
