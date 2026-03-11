import puter from "@heyputer/puter.js";
import {getOrCreateHostingConfig, uploadImageToHosting} from "./puter.hosting";
import {isHostedUrl} from "./utils";
import {PUTER_WORKER_URL} from "./constants";

export const signIn = async () => await puter.auth.signIn();

export const signOut = () => puter.auth.signOut();

export const getCurrentUser = async () => {
    try {
        return await puter.auth.getUser();
    } catch {
        return null;
    }
}

export const createProject = async ({ item, visibility = 'private' }: CreateProjectParams): Promise<DesignItem | null | undefined> => {
    if(!PUTER_WORKER_URL) {
        console.warn('Missing VITE_PUTER_WORKER_URL, skipping project creation');
        return null;
    }
    const projectId = item.id;

    const hosting = await getOrCreateHostingConfig();

    const hostedSource = projectId ? await uploadImageToHosting({
        hosting, url: item.sourceImage, projectId, label: "source"
    }) : null;

    const hostedRender = projectId && item.renderedImage ? await uploadImageToHosting({
        hosting, url: item.renderedImage, projectId, label: "rendered"
    }) : null;

    const resolvedSource = hostedSource?.url || (isHostedUrl(item.sourceImage)
        ? item.sourceImage
        : ''
    );

    if (!resolvedSource) {
        console.warn(`Failed to host source image, skipping project creation`);
        return null;
    }

    const resolvedRender = hostedRender?.url
        ? hostedRender?.url
        : item.renderedImage
            ? item.renderedImage
            : undefined;

    const {
        sourcePath: _sourcePath,
        renderedPath: _renderedPath,
        publicPath: _publicPath,
        ...rest
    } = item;

    const payload = {
        ...rest,
        sourceImage: resolvedSource,
        renderedImage: resolvedRender,
    };

    try {
        const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project: payload, visibility }),
        });

        // ✅ LIS LE TEXTE UNE SEULE FOIS AU DÉBUT
        const responseText = await response.text();
        
        // ✅ Vérifie si c'est vide
        if (!responseText || responseText.trim() === '') {
            console.error('Empty response body');
            return null;
        }

        // ✅ Parse le texte
        let data;
        try {
            data = JSON.parse(responseText) as { project: DesignItem | null };
        } catch (parseError) {
            console.error('Failed to parse JSON response:', responseText);
            return null;
        }

        // ✅ Vérifie le status APRÈS avoir parsé
        if (!response.ok) {
            console.error('Failed to save project:', data);
            return null;
        }

        return data?.project ?? null;
    } catch (e) {
        console.error(`Failed to save project`, e);
        return null;
    }
}

export const getProjects = async () => {
    if (!PUTER_WORKER_URL) {
        console.warn('Missing PUTER_WORKER_URL, skipping projects fetch');
        return [];
    }

    try {
        const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/list`);

        const responseText = await response.text();

        if (!responseText || responseText.trim() === '') {
            console.error('Empty response body');
            return [];
        }

        let data;
        try {
            data = JSON.parse(responseText) as { projects: DesignItem[] | null };
        } catch (parseError) {
            console.error('Failed to parse JSON response:', responseText);
            return [];
        }

        if (!response.ok) {
            console.error('Failed to get projects:', data);
            return [];
        }

        return Array.isArray(data?.projects) ? data.projects : [];
    } catch (e) {
        console.error("Failed to get projects", e);
        return [];
    }
};

export const getProjectById = async ({ id }: { id: string }) => {
    if (!PUTER_WORKER_URL) {
        console.warn("Missing VITE_PUTER_WORKER_URL; skipping project fetch.");
        return null;
    }

    console.log("Fetching project with ID:", id);

    try {
        const response = await puter.workers.exec(
            `${PUTER_WORKER_URL}/api/projects/get?id=${encodeURIComponent(id)}`,
            { method: "GET" },
        );

        console.log("Fetch project response:", response);

        const responseText = await response.text();

        if (!responseText || responseText.trim() === '') {
            console.error('Empty response body');
            return null;
        }

        let data;
        try {
            data = JSON.parse(responseText) as { project?: DesignItem | null };
        } catch (parseError) {
            console.error('Failed to parse JSON response:', responseText);
            return null;
        }

        if (!response.ok) {
            console.error("Failed to fetch project:", data);
            return null;
        }

        console.log("Fetched project data:", data);

        return data?.project ?? null;
    } catch (error) {
        console.error("Failed to fetch project:", error);
        return null;
    }
};