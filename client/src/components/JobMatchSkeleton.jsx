import React from 'react';

const JobMatchSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs animate-pulse space-y-5">
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                    <div className="h-5 bg-slate-200 rounded-md w-3/4"></div>
                    <div className="h-3.5 bg-slate-100 rounded-md w-1/2"></div>
                    <div className="h-3 bg-slate-100 rounded-md w-1/3"></div>
                </div>
                <div className="h-16 w-16 bg-slate-200 rounded-full shrink-0"></div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-3">
                <div className="space-y-1">
                    <div className="flex justify-between">
                        <div className="h-3 bg-slate-200 rounded w-24"></div>
                        <div className="h-3 bg-slate-200 rounded w-8"></div>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full w-full"></div>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between">
                        <div className="h-3 bg-slate-200 rounded w-20"></div>
                        <div className="h-3 bg-slate-200 rounded w-8"></div>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full w-full"></div>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between">
                        <div className="h-3 bg-slate-200 rounded w-28"></div>
                        <div className="h-3 bg-slate-200 rounded w-8"></div>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full w-full"></div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-28"></div>
                <div className="flex gap-2 flex-wrap">
                    <div className="h-6 bg-slate-100 rounded-lg w-16"></div>
                    <div className="h-6 bg-slate-100 rounded-lg w-20"></div>
                    <div className="h-6 bg-slate-100 rounded-lg w-14"></div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-20"></div>
                <div className="flex gap-2 flex-wrap">
                    <div className="h-6 bg-slate-100 rounded-lg w-20"></div>
                    <div className="h-6 bg-slate-100 rounded-lg w-24"></div>
                </div>
            </div>

            <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
        </div>
    );
};

export default JobMatchSkeleton;
