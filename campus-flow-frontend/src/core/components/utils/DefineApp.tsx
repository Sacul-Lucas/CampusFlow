import React, {
    type ReactNode,
    useEffect,
    type ComponentType,
} from "react";

import { renderToStaticMarkup } from "react-dom/server";
import type { LucideProps } from "lucide-react";

interface DefineAppProps {
    appTitle: string;
    appIcon?: string;
    lucideIcon?: ComponentType<LucideProps>;
    bodyStyle?: string;
    children: ReactNode;
}

export const DefineApp: React.FC<DefineAppProps> = ({
    appTitle,
    appIcon,
    lucideIcon: LucideIcon,
    bodyStyle,
    children,
}) => {
    useEffect(() => {
        document.title = appTitle;

        const favicon = document.getElementById(
            "mainFavicon"
        ) as HTMLLinkElement;

        if (!favicon) return;

        if (LucideIcon) {
            const svgString = renderToStaticMarkup(
                <LucideIcon
                    size={64}
                    strokeWidth={2}
                    color="#2563eb"
                />
            );

            const faviconHref =
                `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                    svgString
                )}`;

            favicon.href = faviconHref;

            return;
        }

        if (appIcon) {
            favicon.href = appIcon;
        }
    }, [appTitle, appIcon, LucideIcon]);

    return (
        <div className={bodyStyle}>
            {children}
        </div>
    );
};