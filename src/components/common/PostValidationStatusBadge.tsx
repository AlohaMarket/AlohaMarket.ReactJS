import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { PostStatus } from '@/types/post.type';
import { cn } from '@/lib/utils';

interface PostValidationStatusBadgeProps {
    status?: PostStatus;
    errors?: string[];
    showDetails?: boolean;
    className?: string;
}

export function PostValidationStatusBadge({
    status = PostStatus.PendingValidation,
    errors = [],
    showDetails = false,
    className
}: PostValidationStatusBadgeProps) {
    switch (status) {
        case PostStatus.Validated:
            return (
                <div className={cn("flex flex-col", className)}>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Đã duyệt</span>
                    </Badge>
                </div>
            );
        case PostStatus.Invalid:
            return (
                <div className={cn("flex flex-col", className)}>
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Không hợp lệ</span>
                    </Badge>

                    {showDetails && errors.length > 0 && (
                        <div className="mt-2 p-2 bg-red-50 rounded border border-red-200 text-xs text-red-700">
                            <p className="font-semibold mb-1">Lý do không hợp lệ:</p>
                            <ul className="list-disc pl-4 space-y-1">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            );
        case PostStatus.PendingValidation:
        default:
            return (
                <div className={cn("flex flex-col", className)}>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Đang kiểm duyệt</span>
                    </Badge>
                </div>
            );
    }
}

export default PostValidationStatusBadge;
