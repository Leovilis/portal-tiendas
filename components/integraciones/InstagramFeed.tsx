// src/components/integraciones/InstagramFeed.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface InstagramPost {
    id: string;
    media_url: string;
    permalink: string;
    caption: string;
    timestamp: string;
}

interface InstagramFeedProps {
    accessToken: string;
    limit?: number;
    className?: string;
}

export function InstagramFeed({ accessToken, limit = 6, className }: InstagramFeedProps) {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInstagramPosts = async () => {
            try {
                const response = await fetch(
                    `https://graph.instagram.com/me/media?fields=id,media_url,permalink,caption,timestamp&access_token=${accessToken}&limit=${limit}`
                );

                if (!response.ok) {
                    throw new Error('Error al cargar posts de Instagram');
                }

                const data = await response.json();
                setPosts(data.data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchInstagramPosts();
        }
    }, [accessToken, limit]);

    if (loading) {
        return (
            <div className={cn("grid grid-cols-3 gap-4", className)}>
                {Array.from({ length: limit }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p>No se pudieron cargar los posts de Instagram</p>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p>No hay posts de Instagram para mostrar</p>
            </div>
        );
    }

    return (
        <div className={cn("grid grid-cols-3 gap-4", className)}>
            {posts.map((post) => (
                <a
                    key={post.id}
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square overflow-hidden rounded-lg"
                >
                    <Image
                        src={post.media_url}
                        alt={post.caption || 'Post de Instagram'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm text-center px-2 line-clamp-3">
                            {post.caption}
                        </span>
                    </div>
                </a>
            ))}
        </div>
    );
}