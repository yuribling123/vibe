import {Form, useForm} from "react-hook-form";
import {useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import {z} from "zod";
import {useMutation,useQuery,useQueryClient} from "@tanstack/react-query";
import {ArrowUpIcon, Loader2Icon} from "lucide-react";
import {Button} from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/ui/form";
interface Props{
    projectId: string;
}

// validate what the form should look like using zod
const formScheme = z.object({
    value: z.string()
    .min(1, "Message cannot be empty")
    .max(10000,{message:"Value is too long"}),
})

export const MessageForm = ({projectId}: Props) => {
    const [isFocused, setIsFocused] = useState(false);
    const showUsage = false;

    // create the form object
    const form = useForm<z.infer<typeof formScheme>>({ 
        resolver: zodResolver(formScheme),
        defaultValues: {
            value: "",
        }
    });
    // the value submitted is the type in the formSchema
    const onSubmit = (values:z.infer<typeof formScheme>)=>{
        console.log("submit:", values);
    }
     
    const [isLoading, setIsLoading] = useState(false);
    return (
        <Form {...form}> {/* the form provider */}
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn("relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",isFocused && "shadow-xs",showUsage &&"rounded-t-none")}> {/* html form */}
            <FormField
                control={form.control}
                name="value"
                render={({field})=>(
                    <TextareaAutosize
                        {...field}
                        className="resize-none pt-4  border-none w-full outline-none bg-transparent"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        minRows={2}
                        maxRows={8}
                        placeholder="what would you like to build"
                       
                    />
                )}
            />
        </form>
        </Form>
    );
}
