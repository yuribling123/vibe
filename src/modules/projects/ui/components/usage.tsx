import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { formatDuration, intervalToDuration } from "date-fns";
import { CrownIcon } from "lucide-react";

import Link from "next/link";
import { useMemo } from "react";

interface Props {
    points: number;
    msBeforeNext: number;
}

const Usage = ({ points, msBeforeNext }: Props) => {
    const { has } = useAuth();
    const hasProAccess = has({ plan: "pro" })
    const resetTime = useMemo(() => {
        try {
            return formatDuration(
                intervalToDuration({
                    start: new Date(),
                    end: new Date(Date.now() + msBeforeNext),
                }),
                { format: ["months", "days", "hours", "minutes", "seconds"] }
            )

        }
        catch (error) {
            console.error(error)
            return "soon"

        }

    }, [msBeforeNext])

    return (
        <div className="rounded-t-xl bg-background border border-b-0 p-2.5">

            <div className="flex gap-2 items-center">

                <div>

                    <p className="text-sm">

                        {points} {hasProAccess ? "pro" : "free"} credits remaining

                    </p>

                    <p className="text-xs text-muted-foreground">

                        Reset in {""}{resetTime}
                    

                    </p>

                </div>

                {!hasProAccess &&

                    <Button asChild variant="teritary" size="sm" className="ml-auto">
                        <Link href="/pricing">
                            <CrownIcon /> Upgrade
                        </Link>
                    </Button>

                }




            </div>

        </div>
    );
};

export default Usage;