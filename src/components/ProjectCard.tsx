'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/types/portfolio';

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover transition-transform group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
        />
        {project.featured && (
          <div className="absolute right-2 top-2 bg-bleu-encre px-2 py-1 text-xs font-semibold text-white rounded">
            Phare
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {project.location && (
          <p className="text-xs text-gray-500 mb-1">{project.location}</p>
        )}
        <h3 className="font-semibold text-gray-900 line-clamp-2">{project.title}</h3>
        {project.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Button */}
        <Link
          href={project.viewerUrl}
          className="mt-4 inline-block w-full rounded-lg bg-bleu-encre px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-bleu-encre-clair active:bg-bleu-encre-clair"
        >
          Voir la visite
        </Link>
      </div>
    </div>
  );
}
