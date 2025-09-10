import {ReactNode} from "react";
import {Skeleton} from "@mui/material";

export interface SkeletonWrapperProps {
    children: ReactNode,
    isLoading?: boolean,
}

export function AvoirSkeleton(
    {children, isLoading}: SkeletonWrapperProps,
) {
    return isLoading
        ? <Skeleton variant={"rounded"}>
            {children}
        </Skeleton>
        : children
}

// Helper function to determine if a component should be displayed
// when its value is undefined but it's in a loading state
export const isValueLoading = (value: any, isLoading?: boolean): boolean => {
    return value !== undefined || isLoading === true;
};
