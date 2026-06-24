// src/components/dashboard/StatsCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description?: string;
    trend?: 'up' | 'down';
    trendValue?: string;
    className?: string;
}

export function StatsCard({
    title,
    value,
    icon,
    description,
    trend,
    trendValue,
    className
}: StatsCardProps) {
    return (
        <Card className={cn("overflow-hidden", className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold mt-1">{value}</p>
                    </div>
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        {icon}
                    </div>
                </div>

                {(description || trend) && (
                    <div className="mt-4 flex items-center gap-2 text-sm">
                        {trend && (
                            <span className={cn(
                                "flex items-center gap-1 font-medium",
                                trend === 'up' ? 'text-green-600' : 'text-red-600'
                            )}>
                                {trend === 'up' ? (
                                    <TrendingUp className="h-4 w-4" />
                                ) : (
                                    <TrendingDown className="h-4 w-4" />
                                )}
                                {trendValue}
                            </span>
                        )}
                        {description && (
                            <span className="text-muted-foreground">{description}</span>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}