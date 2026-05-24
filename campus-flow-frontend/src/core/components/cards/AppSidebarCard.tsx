import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/core/components/shadcnComponents/ui/card";
import { SparklesIcon } from "lucide-react"

interface AppSidebarCardProps {
    cardTitle?: string;
    cardDescription?: string;
    cardAction?: React.ReactNode;
    cardFooter?: React.ReactNode;
    children: React.ReactNode;
    cardStyle?: string;
    AIGenerated?: boolean;
}

export const AppSidebarCard: React.FC<AppSidebarCardProps> = ({
    cardTitle,
    cardDescription,
    cardAction,
    cardFooter,
    children,
    cardStyle = "w-full",
    AIGenerated = false
}) => {
    return (
        <Card className={cardStyle}>
            {(cardTitle || cardDescription || cardAction) && <CardHeader>
                {cardTitle && 
                    (
                        <div className="flex flex-row">
                            <CardTitle>
                                {cardTitle}
                            </CardTitle>

                            {AIGenerated ? (<SparklesIcon className="ml-auto"/>) : <></>}
                        </div>
                    )
                }
                {cardDescription && <CardDescription>{cardDescription}</CardDescription>}
                {cardAction && <CardAction>{cardAction}</CardAction>}
            </CardHeader>}
            <CardContent>
                {children}
            </CardContent>
            {cardFooter && <CardFooter className="flex-col gap-2">{cardFooter}</CardFooter>}
        </Card>
    )
}