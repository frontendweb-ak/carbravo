import { ProgramStatusCard } from "./program-status-card";

export interface ProgramStatusSummaryProps {
    draft: number;
    review: number;
    approved: number;
    active: number;
    expired: number;
}

function ProgramStatusSummary({
    draft,
    review,
    approved,
    active,
    expired,
}: ProgramStatusSummaryProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <ProgramStatusCard
                label="Draft"
                value={draft}
                status="draft"
            />

            <ProgramStatusCard
                label="Review"
                value={review}
                status="review"
            />

            <ProgramStatusCard
                label="Approved"
                value={approved}
                status="approved"
            />

            <ProgramStatusCard
                label="Active"
                value={active}
                status="active"
            />

            <ProgramStatusCard
                label="Expired"
                value={expired}
                status="expired"
            />
        </div>
    );
}

export { ProgramStatusSummary };
