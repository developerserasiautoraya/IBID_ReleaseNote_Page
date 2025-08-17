import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

interface AccordionProps {
    title?: string;
    children?: ReactNode;
}
const Accordion = (props: AccordionProps) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    return (
        <div className="pt-1">
            <div className="flex flex-row items-center pt-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="mr-5">{isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</div>
                <div><p className="font-semibold">{props.title}</p></div>
            </div>
            {isExpanded && props.children && (
                <div className="pl-3">
                    {props.children}
                </div>
            )}
        </div>
    )
}
export default Accordion;
