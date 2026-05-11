import {useForm} from "react-hook-form";
import { Form } from "@/components/ui/form";
import {useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import {z} from "zod";
import {useMutation,useQuery,useQueryClient} from "@tanstack/react-query";
import {ArrowUpIcon, Loader2Icon} from "lucide-react";
import {Button} from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/ui/form";
import { useTRPC } from "@/trpc/client";
interface Props{
    projectId: string;
}

// validate what the form should look like using zod
const formScheme = z.object({
    value: z.string()
    .min(1, "Message cannot be empty")
    .max(10000,{message:"Value is too long"}),
})

export const MessageForm = ({projectId}: Props)  => {
    // create the form object
    const form = useForm<z.infer<typeof formScheme>>({  
        resolver: zodResolver(formScheme),
        defaultValues: {
            value: "",
        }
    });

    const [isFocused, setIsFocused] = useState(false);
    const showUsage = false;
    const trpc = useTRPC();
    const createMessage = useMutation(trpc.messages.create.mutationOptions());

    const isPending = createMessage.isPending;
    const isButtonDisabled = isPending || !form.formState.isValid

 
    // when press submit,call trpc backend to (1) save message into database (2)call inngest ai agent for a response and save that reponse to database
    const onSubmit = async (values:z.infer<typeof formScheme>)=>{// the submit type should be the same as the form scheme
        await createMessage.mutateAsync({
            value:values.value,
            projectId,
        });
        form.reset();
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
                    <TextareaAutosize // the textarea that grows as you type
                        {...field}
                        disabled={isPending}
                        className="resize-none pt-4  border-none w-full outline-none bg-transparent"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        minRows={2}
                        maxRows={8}
                        placeholder="what would you like to build"
                        onKeyDown={(e)=>{ 
                            if(e.key==="Enter" && (e.ctrlKey || e.metaKey))  {
                            e.preventDefault();
                            form.handleSubmit(onSubmit)(e);
                            }
                            
                        }}
                       
                    />
                )}
            />
            <div className="flex gap-x-2 items-end justify-between pt-2">
                <div className="text-[10px] text-muted-foreground font-mono">
                    <kbd className="ml-auto pointer-none inline-flex h-5 select-none items-center rounded border bg-muted font-mono text-[10px] font-medium text-muted-foreground"> 
                        <span>&#8984;</span> Enter
                    </kbd>
                    &nbsp; to submit

                </div>
                <Button disabled={isButtonDisabled} className={cn("size-8 rounded-full",isButtonDisabled && "bg-muted-foreground border") } type="submit">
                        {isPending ? <Loader2Icon className="size-4 animate-spin"/> :
                        (<ArrowUpIcon/>)
                         }
                </Button>

            </div>
        </form>
        </Form>
    );
}
